curl -X DELETE -H "Accept:application/json" -H "Content-Type:application/json" http://localhost:8083/connectors/es-sink-report
curl -X DELETE -H "Accept:application/json" -H "Content-Type:application/json" http://localhost:8083/connectors/reporting-connector

curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d @es-sink.json
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d @psql-source.json
