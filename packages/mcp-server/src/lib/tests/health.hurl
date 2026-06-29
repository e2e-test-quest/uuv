GET http://localhost:8000/health
HTTP 200

[Asserts]
header "Content-Type" contains "application/json"
jsonpath "$.status" == "ok"
