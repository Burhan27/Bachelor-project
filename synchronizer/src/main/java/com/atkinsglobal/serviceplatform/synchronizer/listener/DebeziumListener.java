package com.atkinsglobal.serviceplatform.synchronizer.listener;

import com.atkinsglobal.serviceplatform.synchronizer.configuration.ConnectorConfig;
import com.atkinsglobal.serviceplatform.synchronizer.utils.Operation;
import com.atkinsglobal.serviceplatform.synchronizer.service.ReportService;
import io.debezium.config.Configuration;
import io.debezium.embedded.EmbeddedEngine;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.kafka.connect.data.Field;
import org.apache.kafka.connect.data.Struct;
import org.apache.kafka.connect.source.SourceRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import com.atkinsglobal.serviceplatform.synchronizer.configuration.ConnectorConfig.*;

import static io.debezium.data.Envelope.FieldName.*;;
import static java.util.stream.Collectors.toMap;

@Slf4j
@Component
public class DebeziumListener {

    private final Executor executor = Executors.newSingleThreadExecutor();

    /**
     * The Debezium engine which needs to be loaded with the configurations, Started and Stopped - for the
     * CDC to work.
     */
    private final EmbeddedEngine engine;

    /**
     * Handle to the Service layer, which interacts with ElasticSearch.
     */
    private final ReportService reportService;

    @Autowired
    private ConnectorConfig connectorConfig;

    /**
     * Constructor which loads the configurations and sets a callback method 'handleEvent', which is invoked when
     * a DataBase transactional operation is performed.
     *
     * @param PostgresConnector
     * @param reportService
     */
    private DebeziumListener(Configuration PostgresConnector, ReportService reportService) {
        this.engine = EmbeddedEngine
                .create()
                .using(connectorConfig.PostgresConnector())
                .notifying(this::handleEvent).build();

        this.reportService = reportService;
    }

    /**
     * The method is called after the Debezium engine is initialized and started asynchronously using the Executor.
     */
    @PostConstruct
    private void start() {
        this.executor.execute(engine);
    }

    /**
     * This method is called when the container is being destroyed. This stops the debezium, merging the Executor.
     */
    @PreDestroy
    private void stop() {
        if (this.engine != null) {
            this.engine.stop();
        }
    }

    /**
     * This method is invoked when a transactional action is performed on any of the tables that were configured.
     *
     * @param sourceRecord
     */
    private void handleEvent(SourceRecord sourceRecord) {
        Struct sourceRecordValue = (Struct) sourceRecord.value();

        if(sourceRecordValue != null) {
            Operation operation = Operation.forCode((String) sourceRecordValue.get(OPERATION));
            System.out.println(sourceRecordValue.get(OPERATION));
            //Only if this is a transactional operation.
            if(operation != Operation.READ) {

                Map<String, Object> message;
                String record = AFTER; //For Update & Insert operations.

                if (operation == Operation.DELETE) {
                    record = BEFORE; //For Delete operations.
                }

                //Build a map with all row data received.
                Struct struct = (Struct) sourceRecordValue.get(record);
                message = struct.schema().fields().stream()
                        .map(Field::name)
                        .filter(fieldName -> struct.get(fieldName) != null)
                        .map(fieldName -> Pair.of(fieldName, struct.get(fieldName)))
                        .collect(toMap(Pair::getKey, Pair::getValue));

                //Call the service to handle the data change.
                this.reportService.maintainReadModel(message, operation);
                System.out.println("Data Changed: {"+ message+"} with Operation: {"+ operation.name() +"}");
            }
        }
    }

}
