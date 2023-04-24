<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230424124031 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create bike entity';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE bike_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE bike (id INT NOT NULL, owner_id INT NOT NULL, bike_type_id INT DEFAULT NULL, picture_id INT DEFAULT NULL, wheel_picture_id INT DEFAULT NULL, transmission_picture_id INT DEFAULT NULL, brand VARCHAR(255) DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, description TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_4CBC37807E3C61F9 ON bike (owner_id)');
        $this->addSql('CREATE INDEX IDX_4CBC37807FF015AE ON bike (bike_type_id)');
        $this->addSql('CREATE INDEX IDX_4CBC3780EE45BDBF ON bike (picture_id)');
        $this->addSql('CREATE INDEX IDX_4CBC378093E0DCF6 ON bike (wheel_picture_id)');
        $this->addSql('CREATE INDEX IDX_4CBC37806B1E0CCD ON bike (transmission_picture_id)');
        $this->addSql('COMMENT ON COLUMN bike.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE bike ADD CONSTRAINT FK_4CBC37807E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE bike ADD CONSTRAINT FK_4CBC37807FF015AE FOREIGN KEY (bike_type_id) REFERENCES bike_type (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE bike ADD CONSTRAINT FK_4CBC3780EE45BDBF FOREIGN KEY (picture_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE bike ADD CONSTRAINT FK_4CBC378093E0DCF6 FOREIGN KEY (wheel_picture_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE bike ADD CONSTRAINT FK_4CBC37806B1E0CCD FOREIGN KEY (transmission_picture_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE bike_id_seq CASCADE');
        $this->addSql('ALTER TABLE bike DROP CONSTRAINT FK_4CBC37807E3C61F9');
        $this->addSql('ALTER TABLE bike DROP CONSTRAINT FK_4CBC37807FF015AE');
        $this->addSql('ALTER TABLE bike DROP CONSTRAINT FK_4CBC3780EE45BDBF');
        $this->addSql('ALTER TABLE bike DROP CONSTRAINT FK_4CBC378093E0DCF6');
        $this->addSql('ALTER TABLE bike DROP CONSTRAINT FK_4CBC37806B1E0CCD');
        $this->addSql('DROP TABLE bike');
    }
}
