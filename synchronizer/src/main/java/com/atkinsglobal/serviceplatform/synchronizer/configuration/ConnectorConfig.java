package com.atkinsglobal.serviceplatform.synchronizer.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConnectorConfig {

    @Value("$postgres.url")
    private String hostName;

    @Bean
    public io.debezium.config.Configuration PostgresConnector() {
        return io.debezium.config.Configuration.create()
                .with("name", "report-postgres-connector")
                .with("connector.class", "io.debezium.connector.postgresql.PostgresConnector")
                .with("offset.storage",  "org.apache.kafka.connect.storage.FileOffsetBackingStore")
                .with("offset.storage.file.filename", "/path/cdc/offset/report-offset.dat")
                .with("offset.flush.interval.ms", 60000)
                .with("database.server.name", "reporting_synchronizer")
                .with("database.hostname", "localhost")
                .with("database.port", 5432)
                .with("database.user", "debezium_user")
                .with("database.password", "postgres")
                .with("database.dbname", "platformdatabase")
                .with("database.include.list", "platformdatabase")
                .with("schema.include.list","repo")
                .with("table.include.list", "repo.report")
                .with("plugin.name", "pgoutput")
                .with( "transforms", "route")
                .with( "transforms.route.type", "org.apache.kafka.connect.transforms.RegexRouter")
                .with("transforms.route.regex", "([^.]+)\\.([^.]+)\\.([^.]+)")
                .with("transforms.route.replacement", "$3")
                .build();
    }

}
