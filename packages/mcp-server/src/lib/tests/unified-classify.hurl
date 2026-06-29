POST http://localhost:8000/api/v1/image/classify-unified

[Multipart]
html_content: <section class="mb-5"><h2 style="outline: none; outline-offset: -2px;">First part</h2><img src="/images/random_img.jpg" width="600" style="outline: none; outline-offset: -2px;"><p>Please join us on that day !</p></section>
css_selector: img:nth-of-type(1)
target_img_file: file,crocus.jpg;

HTTP 200

[Asserts]
header "Content-Type" == "application/x-ndjson"
# Assert contains 2 lignes exactly
body matches /^[^\n]*\n[^\n]*\n?$/
# Assert ligne 1 contains image_description
body matches /^[^\n]*"image_description"[^\n]*\n/
# Assert ligne 2 contains 4 fields at least
body matches /\n[^\n]*"image_description"[^\n]*/
body matches /\n[^\n]*"is_decorative"[^\n]*/
body matches /\n[^\n]*"confidence"[^\n]*/
body matches /\n[^\n]*"analysis_details"[^\n]*/
