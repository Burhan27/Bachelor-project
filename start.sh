# Create report index
curl -i -X PUT -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:9200/report

# Add mapping to report
curl -i -X PUT -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:9200/report/_mapping -d @report.json
##curl -i -X PUT -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:9200/_ingest/pipeline/my-pipeline -d @es-date-pipeline.json

curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d @es-sink.json
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d @psql-source.json


