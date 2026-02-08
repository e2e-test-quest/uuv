<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";

  let url = $state(null);
  let defaultTargetUrl = "https://google.fr";

  async function openUrl(event: Event) {
    event.preventDefault();
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    await invoke("open_url_with_uuv_assistant", { url: url ?? defaultTargetUrl });
  }
</script>

<main>
  <div id="page_content">
    <div class="page_row">
      <img
        id='uuv_logo'
        src='https://e2e-test-quest.github.io/uuv/img/uuv.png'
        alt='UUV logo'
      />
      <h1>UUV Assistant</h1>
      <div class='flex_row_center'>
        <a class='tooltip' data-sveltekit-reload href="https://e2e-test-quest.github.io/uuv/docs/wordings/generated-wording-description/en-generated-wording-description">
          <img src='https://img.shields.io/badge/sentences-grey?style=for-the-badge&logo=github&logoColor=white'
            alt='documentation containing sentences'/>
          <span class='tooltiptext'>Available dictionary of sentences</span>
        </a>
        <a class='tooltip' data-sveltekit-reload href="https://e2e-test-quest.github.io/uuv/">
          <img src='https://img.shields.io/badge/UUV documentation-grey?style=for-the-badge&logo=github&logoColor=white'
            alt='documentation'/>
          <span class='tooltiptext'>Online documentation</span>
        </a>
        <a class='tooltip' data-sveltekit-reload href="https://github.com/e2e-test-quest/uuv/">
          <img src='https://img.shields.io/badge/Github-black?&style=for-the-badge&logo=github&logoColor=white'
            alt='gitHub'/>
          <span class='tooltiptext'>Github project</span>
        </a>
      </div>
      <div class='flex_row_center'>
        <a class='tooltip' data-sveltekit-reload href="https://www.npmjs.com/package/@uuv/assistant">
          <img src='https://img.shields.io/badge/@uuv/assistant-grey?style=for-the-badge&logo=npm'
            alt='@uuv/assistant npm library'/>
          <span class='tooltiptext'>visit @uuv/assistant npmjs lib</span>
        </a>
        <a class='tooltip' data-sveltekit-reload href="https://www.npmjs.com/package/@uuv/cypress">
          <img src='https://img.shields.io/badge/@uuv/cypress-grey?style=for-the-badge&logo=npm'
            alt='@uuv/cypress npm library'/>
          <span class='tooltiptext'>visit @uuv/cypress npmjs lib</span>
        </a>
        <a class='tooltip' data-sveltekit-reload href="https://www.npmjs.com/package/@uuv/playwright">
          <img src='https://img.shields.io/badge/@uuv/playwright-grey?style=for-the-badge&logo=npm'
            alt='@uuv/playwright npm library'/>
          <span class='tooltiptext'>visit @uuv/playwright npmjs lib</span>
        </a>
      </div>
    </div>
    <div class="page_row">
      <div id="call-to-action">
        <h2>To start, enter the url of your web application, then validate :</h2>
        <p>@uuv library (User centric Usecases Validator) is an ecosystem that simplifies the writing of End to End tests in a BDD approach and a user-centric way. With this tool, we can generate cucumber sentences that will use an execution engine like cypress with @uuv/cypress or playwright with @uuv/playwright.</p>
      </div>
      <form id="search" onsubmit={openUrl}>
        <input id="target_url" type="text" placeholder={defaultTargetUrl} bind:value={url} />
        <button type="submit">Open</button>
      </form>
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

  .page_row {
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

</style>
