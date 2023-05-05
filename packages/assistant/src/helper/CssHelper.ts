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

export interface HtmlElementProps {
  color?: string;
  background?: string;
  url?: string;
  shadow?: string;
  rotate?: number;
}

export class CssHelper {

  public static buttonConfig = (isDark: boolean) => {
    return isDark ? {
    background: "#0b4c89",
    color: "#FFF"
  } as HtmlElementProps : {
    background: "#d6e4ff",
    color: "#000"
  } as HtmlElementProps;
  };

  static expanderConfig = (isDark: boolean, isExtended: boolean) => {
    return isDark ? {
      background: "#0b4c89",
      shadow: "rgba(250, 250, 250, 0.16) 0px 10px 36px 0px, rgba(250, 250, 250, 0.06) 0px 0px 0px 1px",
      rotate: isExtended ? 270 : 90,
      color: "white"
    } as HtmlElementProps : {
      background: "#d6e4ff",
      shadow: "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
      rotate: isExtended ? 270 : 90,
      color: "black"
    } as HtmlElementProps;
  };
}
