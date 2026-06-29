<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { Command, Child } from '@tauri-apps/plugin-shell';

  const DEFAULT_TARGET_URL = "https://google.fr";
  const UUV_AGENT_HEALTH_URL = "http://localhost:8000/health";

  let serverProcess: Child | null = null

  let url = $state(null);
  let status = $state<UUV_AGENT_STATE>(UUV_AGENT_STATE.stopped);
  let llmModel = $state('');
  let llmApiUrl = $state('http://localhost:11434');
  let errorMessage = $state('');
  let isConfigOpen = $state(false);

  listenStatusUpdate();

  async function listenStatusUpdate(globalTimeoutMs: number = 3 * 60 * 1000) {
    const response = await isUrlAvailable(
        UUV_AGENT_HEALTH_URL,
        { globalTimeoutMs, retryDelayMs: 2000, requestTimeoutMs: 2000 }
    );
    if(response.available) {
      status = UUV_AGENT_STATE.started;
      llmApiUrl = (response.body as any)?.llmApi ?? llmApiUrl;
      llmModel = (response.body as any)?.llmModel ?? llmModel;
    } else {
      status = UUV_AGENT_STATE.stopped;
    }
  }

  async function openUrl(event: Event) {
    event.preventDefault();
    await invoke("open_url_with_uuv_assistant", { url: url != null && url.toString().trim() != '' ? url : DEFAULT_TARGET_URL });
  }

  enum UUV_AGENT_STATE {
    stopped = 'stopped',
    loading = 'loading',
    started = 'started'
  }

  function validateBeforeSubmit(event: Event): boolean {
    if (!llmModel.trim()) {
      errorMessage = 'LLM model is required';
      event.preventDefault();
      return false;
    }
    if (llmModel.trim().startsWith('ollama/') && !llmApiUrl.trim()) {
      errorMessage = "An API URL is required for ollama/ models";
      event.preventDefault();
      return false;
    }
    errorMessage = '';
    return true;
  }

  async function handleServiceToggle(event: Event) {
    if (status === UUV_AGENT_STATE.started) {
      await stopServer();
    } else {
      if (!validateBeforeSubmit(event)) return;
      status = UUV_AGENT_STATE.loading;
      errorMessage = '';
      await startServer();
    }
  }

  export async function startServer() {
    if (serverProcess) {
      console.warn('Server already running')
      return
    }

    const sysEnv = await invoke<Record<string, string>>('get_env_vars')

    const command = Command.create(
        'npx',
        [
          '-y',
          '@uuv/mcp-server'
        ],
        {
          env: {
            ...sysEnv,
            UUV_LLM_MODEL: llmModel,
            UUV_LLM_API: llmApiUrl,
            UUV_API_ENABLED: 'true',
            PINO_LOG_LEVEL: 'debug'
          },
        }
    )

    command.stdout.on('data', (line) => {
      console.log('[server stdout]', line)
    })
    command.stderr.on('data', (line) => {
      console.error('[server stderr]', line)
    })

    command.on('close', (data) => {
      console.log(`Server stoppped (code: ${data.code})`)
      serverProcess = null
      status = UUV_AGENT_STATE.stopped;
    })

    command.on('error', (err) => {
      status = UUV_AGENT_STATE.stopped;
      console.error('Server error :', err)
      serverProcess = null
    })

    serverProcess = await command.spawn()
    console.log('Server started, PID:', serverProcess.pid)
    await listenStatusUpdate(10 * 60 * 1000);
  }

  export async function stopServer() {
    if (!serverProcess) {
      console.warn('No server is running')
      return
    }

    await serverProcess.kill()
    serverProcess = null
  }

  export function uuvAgentStatusLabel(status: UUV_AGENT_STATE) {
    switch (status) {
      case UUV_AGENT_STATE.loading:
        return "Starting..."
      case UUV_AGENT_STATE.started:
        return "Started"
      case UUV_AGENT_STATE.stopped:
        return "Stopped"
    }
  }

  export function uuvAgentButtonLabel(status: UUV_AGENT_STATE) {
    switch (status) {
      case UUV_AGENT_STATE.loading:
        return "Starting...."
      case UUV_AGENT_STATE.started:
        return "■ Stop"
      case UUV_AGENT_STATE.stopped:
        return "▶ Start"
    }
  }

  export function isUuvAgentStopped(status: UUV_AGENT_STATE) {
    return status === UUV_AGENT_STATE.stopped
  }

  export function isUuvAgentLoading(status: UUV_AGENT_STATE) {
    return status === UUV_AGENT_STATE.loading
  }

  export type UrlTestOptions = {
    globalTimeoutMs: number;
    retryDelayMs: number,
    requestTimeoutMs: number
  }

  async function isUrlAvailable(url, options: UrlTestOptions) {

    const startTime = Date.now();
    let lastError = null;

    while (Date.now() - startTime < options.globalTimeoutMs) {
      const controller = new AbortController();
      const requestTimeoutId = setTimeout(() => controller.abort(), options.requestTimeoutMs);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });
        clearTimeout(requestTimeoutId);

        if (response.ok) {
          const body = await (response.json());
          return {
            available: true,
            status: response.status,
            body: body
          };
        }

        lastError = `Status ${response.status}`;
      } catch (error) {
        clearTimeout(requestTimeoutId);
        lastError = error.message;
      }

      console.log('lastError', lastError);

      const elapsed = Date.now() - startTime;
      const remaining = options.globalTimeoutMs - elapsed;
      if (remaining <= 0) break;

      await new Promise(resolve => setTimeout(resolve, Math.min(options.retryDelayMs, remaining)));
    }

    return { available: false, error: lastError, body: null };
  }

</script>

<main>
  <div id="page_content">
    <div class="page_column">
      <img
          id='uuv_logo'
          src='https://e2e-test-quest.github.io/uuv/img/uuv.png'
          alt='UUV logo'
      />
      <h1>UUV Assistant</h1>
      <div class='flex_row_center'>
        <a class='tooltip' data-sveltekit-reload href="https://e2e-test-quest.github.io/uuv/docs/wordings/generated-wording-description/en-generated-wording-description">
          <img src='https://img.shields.io/badge/sentences-grey?style=for-the-badge&logo=read-the-docs&logoColor=white'
               alt='documentation containing sentences'/>
          <span class='tooltiptext'>Available dictionary of sentences</span>
        </a>
        <a class='tooltip' data-sveltekit-reload href="https://e2e-test-quest.github.io/uuv/">
          <img src='https://img.shields.io/badge/UUV documentation-grey?style=for-the-badge&logo=read-the-docs&logoColor=white'
               alt='documentation'/>
          <span class='tooltiptext'>Online documentation</span>
        </a>
        <a class='tooltip' data-sveltekit-reload href="https://github.com/e2e-test-quest/uuv/">
          <img src='https://img.shields.io/badge/Github%20project-grey?&style=for-the-badge&logo=github&logoColor=white'
               alt='gitHub project'/>
          <span class='tooltiptext'>Github project</span>
        </a>
      </div>
      <div class='flex_row_center'>
        <a class='tooltip' data-sveltekit-reload href="https://www.npmjs.com/package/@uuv/assistant">
          <img src='https://img.shields.io/npm/dt/%40uuv%2Fassistant?label=%40uuv%2Fassistant&style=for-the-badge'
               alt='@uuv/assistant npm library'/>
          <span class='tooltiptext'>visit @uuv/assistant npmjs lib</span>
        </a>
        <a class='tooltip' data-sveltekit-reload href="https://www.npmjs.com/package/@uuv/cypress">
          <img src='https://img.shields.io/npm/dt/%40uuv%2Fcypress?label=%40uuv%2Fcypress&style=for-the-badge'
               alt='@uuv/cypress npm library'/>
          <span class='tooltiptext'>visit @uuv/cypress npmjs lib</span>
        </a>
        <a class='tooltip' data-sveltekit-reload href="https://www.npmjs.com/package/@uuv/playwright">
          <img src='https://img.shields.io/npm/dt/%40uuv%2Fplaywright?label=%40uuv%2Fplaywright&style=for-the-badge'
               alt='@uuv/playwright npm library'/>
          <span class='tooltiptext'>visit @uuv/playwright npmjs lib</span>
        </a>
      </div>
    </div>
    <div class="page_column">
      <div id="call-to-action">
        <h2>To start, enter the url of your web application, then validate :</h2>
        <p>UUV is an accessibility driven solution to facilitate the writing and execution of end-to-end tests that are understandable to any human being. With this UUV Assistant, you can generate tests scenario that will use an execution engine like cypress with @uuv/cypress or playwright with @uuv/playwright.</p>
      </div>
      <form id="search" onsubmit={openUrl}>
        <input id="target_url" type="text" placeholder={DEFAULT_TARGET_URL} bind:value={url} />
        <button type="submit">Open</button>
      </form>

      <div id="ai-config-panel">
        <button
            type="button"
            id="ai-config-toggle"
            aria-expanded={isConfigOpen}
            aria-controls="ai-config-body"
            onclick={() => isConfigOpen = !isConfigOpen}
        >
          <div class="toggle-left">
            <span class="toggle-icon" aria-hidden="true">✦</span>
            <div class="toggle-titles">
              <span class="toggle-title">AI Configuration <span class="optional-badge">Optional</span></span>
              <span class="toggle-subtitle">Connect a model to unlock smarter results and new features</span>
              <span class="status-dot {status}">
                  ● {uuvAgentStatusLabel(status)}
                </span>
            </div>
          </div>
          <span class="chevron" class:open={isConfigOpen} aria-hidden="true">▼</span>
        </button>

        <div id="ai-config-body" class="config-body" class:open={isConfigOpen} role="region" aria-label="AI Configuration">
          <p class='config-description'>
            Connect an LLM to supercharge UUV Assistant: improve image accessibility, get smarter selector suggestions,
            better scenario generation.
            Works with OpenAI, Anthropic, or any Ollama model.
          </p>
          {#if errorMessage}
            <p class='error-message' role="alert">{errorMessage}</p>
          {/if}
          <form id="service-config" onsubmit={handleServiceToggle}>
            <div class="form-row">
              <label class="required" for="llm_model">LLM model</label>
              <input id="llm_model" type="text" placeholder="e.g. openai/gpt-4, anthropic/claude-sonnet-4-6, ollama/llama3" bind:value={llmModel} disabled='{!isUuvAgentStopped(status)}' />
            </div>
            <div class="form-row">
              <label for="llm_api_url">Ollama API</label>
              <div id="url_wrapper">
                <input id="llm_api_url" type="text" placeholder="e.g. http://localhost:11434" bind:value={llmApiUrl} disabled='{!isUuvAgentStopped(status)}' />
              </div>
            </div>
            <div class="form-row">
              <p class='conditional-required'>(required for ollama/… models)</p>
            </div>
            <button
                id="service_toggle_submit"
                type="submit"
                disabled={isUuvAgentLoading(status)}
                class="{status}"
            >
              {uuvAgentButtonLabel(status)}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  #uuv_logo {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 300px;
    height: auto;
    padding-top:2em;
    margin-bottom: 0;
    filter: drop-shadow(0 0 0.2rem white);
  }

  * {
    outline: none;
  }

  #page_content {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 100px;
  }

  .tooltip {
    position: relative;
    display: inline-block;
    cursor: pointer;
    padding: 3px;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }

  h1 {
    margin: 0.25em 0;
  }

  #call-to-action {
    text-align: center;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  #call-to-action p {
    font-size: 16px;
    font-style: italic;
  }

  .page_column {
    max-width: 45%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .flex_row_center {
    display: flex;
    justify-content: center;
  }

  button {
    cursor: pointer;
  }

  #search {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2em;
  }

  #search input {
    padding: 0px 7px !important;
    font-size: 24px;
    background: #fbfbfb;
    border: 2px solid transparent;
    height: 36px;
    box-shadow: 0 0 0 1px #dddddd, 0 2px 4px 0 rgb(0 0 0 / 7%), 0 1px 1.5px 0 rgb(0 0 0 / 5%);
    min-width: 500px;
  }

  #search input:focus {
    border: 2px solid #000;
  }

  #search button {
    cursor: pointer;
    outline: 0;
    color: #000;
    background-color: #f0c419;
    display: inline-block;
    font-weight: bold;
    line-height: 1.5;
    text-align: center;
    border: 1px solid transparent;
    padding: 1px 15px;
    font-size: 20px;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  }

  #search button:hover {
    color: #fff;
    background-color: #2d66c3;
  }

  main {
    margin: 0;
    background-image: url("/background.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    color: white;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    height: 100%;
    overflow-y: auto;
  }

  /* ── Collapsible panel shell ── */
  #ai-config-panel {
    width: 80%;
    min-width: 600px;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  /* ── Toggle header button ── */
  #ai-config-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    border: none;
    padding: 14px 20px;
    cursor: pointer;
    transition: background 0.15s ease;
    gap: 10px;
  }

  #ai-config-toggle:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .toggle-left {
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
  }

  .toggle-icon {
    font-size: 18px;
    color: #b08800;
    flex-shrink: 0;
  }

  .toggle-titles {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .toggle-title {
    font-size: 15px;
    font-weight: bold;
    color: #111;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toggle-subtitle {
    font-size: 12px;
    color: #555;
  }

  .optional-badge {
    font-size: 11px;
    font-weight: normal;
    background: #e8f4e8;
    color: #2e7d32;
    padding: 2px 8px;
    border-radius: 20px;
  }

  .chevron {
    font-size: 18px;
    color: #555;
    transition: transform 0.25s ease;
    flex-shrink: 0;
  }

  .chevron.open {
    transform: rotate(180deg);
  }

  /* ── Collapsible body ── */
  .config-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    padding: 0 20px;
    border-top: 0 solid transparent;
  }

  .config-body.open {
    max-height: 500px;
    padding: 16px 20px 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }

  /* ── Inner form ── */
  #service-config {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    width: 100%;
  }

  .config-description {
    font-size: 13px;
    color: #333;
    text-align: center;
    line-height: 1.6;
    margin: 0 0 12px;
  }

  #service-config label {
    font-weight: bold;
    font-size: 14px;
    color: #000;
  }

  .conditional-required {
    font-weight: normal;
    font-size: 12px;
    color: #666;
    font-style: italic;
    text-align: start;
    margin: 0;
    width: 438px;
  }

  label.required:after {
    content: "*";
    color: #e00000;
    display: inline-block;
  }

  #service-config input {
    padding: 0px 7px !important;
    font-size: 16px;
    background: #fbfbfb;
    border: 2px solid transparent;
    height: 36px;
    box-shadow: 0 0 0 1px #dddddd, 0 2px 4px 0 rgb(0 0 0 / 7%), 0 1px 1.5px 0 rgb(0 0 0 / 5%);
    width: 420px;
    max-width: 100%;
  }

  #service-config input:focus {
    border: 2px solid #000;
  }

  .error-message {
    color: #d32f2f;
    font-size: 14px;
    font-weight: bold;
    margin-left: 30px;
  }

  #service_toggle_submit {
    cursor: pointer;
    outline: 0;
    color: #000;
    display: inline-block;
    font-weight: bold;
    line-height: 1.5;
    text-align: center;
    border: 1px solid transparent;
    padding: 4px 8px;
    font-size: 16px;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    margin-top: 0.5em;
    align-self: center;
  }

  #service_toggle_submit.stopped {
    background-color: #4caf50;
    color: #fff;
  }

  #service_toggle_submit.stopped:hover {
    background-color: #388e3c;
  }

  #service_toggle_submit.started {
    background-color: #c42e2e;
    color: #fff;
  }

  #service_toggle_submit.started:hover {
    background-color: #d32f2f;
  }

  #service_toggle_submit.loading {
    background-color: #2d66c3;
  }

  .form-row {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
    gap: 15px;
  }

  #service-config input::placeholder {
    font-size: 12px;
  }

  input:disabled, #service-config input:disabled {
    background-color: lightgrey;
    color: black;
  }

  .status-dot {
    font-size: 12px;
    font-weight: 500;
    color: #999;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s ease;
  }

  .status-dot.started {
    color: #2e7d32;
  }

  .status-dot.loading {
    color: #f57c00;
    animation: pulse-text 1.2s ease-in-out infinite;
  }

  @keyframes pulse-text {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
</style>