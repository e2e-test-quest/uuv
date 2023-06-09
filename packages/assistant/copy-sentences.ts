/**
 * Copyright UUV.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import fs from "fs";


function copySentences() {
  console.log("Copying sentences");
  fs.copyFileSync("../runner-commons/src/assets/i18n/en.json", "src/assets/en.json");
  fs.copyFileSync("../runner-commons/src/assets/i18n/en-enriched-wordings.json", "src/assets/en-enriched-wordings.json");
  console.log("Sentences copied");
}

copySentences();
