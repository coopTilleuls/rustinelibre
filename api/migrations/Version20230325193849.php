<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230325193849 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'First migration to initiate database';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SEQUENCE appointment_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE bike_type_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE media_object_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE refresh_tokens_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE repairer_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE repairer_employee_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE repairer_type_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE appointment (id INT NOT NULL, customer_id INT DEFAULT NULL, repairer_id INT NOT NULL, slot_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, duration INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_FE38F8449395C3F3 ON appointment (customer_id)');
        $this->addSql('CREATE INDEX IDX_FE38F84447C5DFEE ON appointment (repairer_id)');
        $this->addSql('COMMENT ON COLUMN appointment.slot_time IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE bike_type (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE media_object (id INT NOT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE refresh_tokens (id INT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9BACE7E1C74F2195 ON refresh_tokens (refresh_token)');
        $this->addSql('CREATE TABLE repairer (id INT NOT NULL, owner_id INT NOT NULL, repairer_type_id INT DEFAULT NULL, thumbnail_id INT DEFAULT NULL, description_picture_id INT DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, description TEXT DEFAULT NULL, mobile_phone VARCHAR(255) DEFAULT NULL, street VARCHAR(800) DEFAULT NULL, city VARCHAR(255) DEFAULT NULL, postcode VARCHAR(255) DEFAULT NULL, country VARCHAR(255) DEFAULT NULL, rrule VARCHAR(255) DEFAULT NULL, latitude VARCHAR(255) DEFAULT NULL, longitude VARCHAR(255) DEFAULT NULL, first_slot_available TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4A73F2BF7E3C61F9 ON repairer (owner_id)');
        $this->addSql('CREATE INDEX IDX_4A73F2BFD2C6BD92 ON repairer (repairer_type_id)');
        $this->addSql('CREATE INDEX IDX_4A73F2BFFDFF2E92 ON repairer (thumbnail_id)');
        $this->addSql('CREATE INDEX IDX_4A73F2BF51A96A7E ON repairer (description_picture_id)');
        $this->addSql('CREATE TABLE repairer_bike_type (repairer_id INT NOT NULL, bike_type_id INT NOT NULL, PRIMARY KEY(repairer_id, bike_type_id))');
        $this->addSql('CREATE INDEX IDX_D5AC763447C5DFEE ON repairer_bike_type (repairer_id)');
        $this->addSql('CREATE INDEX IDX_D5AC76347FF015AE ON repairer_bike_type (bike_type_id)');
        $this->addSql('CREATE TABLE repairer_employee (id INT NOT NULL, repairer_id INT NOT NULL, employee_id INT NOT NULL, enabled BOOLEAN NOT NULL, since_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2A8FCF0647C5DFEE ON repairer_employee (repairer_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2A8FCF068C03F15C ON repairer_employee (employee_id)');
        $this->addSql('CREATE TABLE repairer_type (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, email_confirmed BOOLEAN NOT NULL, password VARCHAR(255) NOT NULL, last_name VARCHAR(255) DEFAULT NULL, first_name VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_FE38F8449395C3F3 FOREIGN KEY (customer_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_FE38F84447C5DFEE FOREIGN KEY (repairer_id) REFERENCES repairer (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer ADD CONSTRAINT FK_4A73F2BF7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer ADD CONSTRAINT FK_4A73F2BFD2C6BD92 FOREIGN KEY (repairer_type_id) REFERENCES repairer_type (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer ADD CONSTRAINT FK_4A73F2BFFDFF2E92 FOREIGN KEY (thumbnail_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer ADD CONSTRAINT FK_4A73F2BF51A96A7E FOREIGN KEY (description_picture_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer_bike_type ADD CONSTRAINT FK_D5AC763447C5DFEE FOREIGN KEY (repairer_id) REFERENCES repairer (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer_bike_type ADD CONSTRAINT FK_D5AC76347FF015AE FOREIGN KEY (bike_type_id) REFERENCES bike_type (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer_employee ADD CONSTRAINT FK_2A8FCF0647C5DFEE FOREIGN KEY (repairer_id) REFERENCES repairer (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer_employee ADD CONSTRAINT FK_2A8FCF068C03F15C FOREIGN KEY (employee_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE appointment_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE bike_type_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE media_object_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE refresh_tokens_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE repairer_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE repairer_employee_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE repairer_type_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('ALTER TABLE appointment DROP CONSTRAINT FK_FE38F8449395C3F3');
        $this->addSql('ALTER TABLE appointment DROP CONSTRAINT FK_FE38F84447C5DFEE');
        $this->addSql('ALTER TABLE repairer DROP CONSTRAINT FK_4A73F2BF7E3C61F9');
        $this->addSql('ALTER TABLE repairer DROP CONSTRAINT FK_4A73F2BFD2C6BD92');
        $this->addSql('ALTER TABLE repairer DROP CONSTRAINT FK_4A73F2BFFDFF2E92');
        $this->addSql('ALTER TABLE repairer DROP CONSTRAINT FK_4A73F2BF51A96A7E');
        $this->addSql('ALTER TABLE repairer_bike_type DROP CONSTRAINT FK_D5AC763447C5DFEE');
        $this->addSql('ALTER TABLE repairer_bike_type DROP CONSTRAINT FK_D5AC76347FF015AE');
        $this->addSql('ALTER TABLE repairer_employee DROP CONSTRAINT FK_2A8FCF0647C5DFEE');
        $this->addSql('ALTER TABLE repairer_employee DROP CONSTRAINT FK_2A8FCF068C03F15C');
        $this->addSql('DROP TABLE appointment');
        $this->addSql('DROP TABLE bike_type');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE repairer');
        $this->addSql('DROP TABLE repairer_bike_type');
        $this->addSql('DROP TABLE repairer_employee');
        $this->addSql('DROP TABLE repairer_type');
        $this->addSql('DROP TABLE "user"');
    }
}
