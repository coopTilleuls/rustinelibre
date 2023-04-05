<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230405090557 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add pictures in repairer table';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE repairer ADD thumbnail_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD description_picture_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD CONSTRAINT FK_4A73F2BFFDFF2E92 FOREIGN KEY (thumbnail_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer ADD CONSTRAINT FK_4A73F2BF51A96A7E FOREIGN KEY (description_picture_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_4A73F2BFFDFF2E92 ON repairer (thumbnail_id)');
        $this->addSql('CREATE INDEX IDX_4A73F2BF51A96A7E ON repairer (description_picture_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE repairer DROP CONSTRAINT FK_4A73F2BFFDFF2E92');
        $this->addSql('ALTER TABLE repairer DROP CONSTRAINT FK_4A73F2BF51A96A7E');
        $this->addSql('DROP INDEX IDX_4A73F2BFFDFF2E92');
        $this->addSql('DROP INDEX IDX_4A73F2BF51A96A7E');
        $this->addSql('ALTER TABLE repairer DROP thumbnail_id');
        $this->addSql('ALTER TABLE repairer DROP description_picture_id');
    }
}
