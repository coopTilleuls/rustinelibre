<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230530142205 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add author in maintenance table';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE maintenance ADD author_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE maintenance ADD CONSTRAINT FK_2F84F8E9F675F31B FOREIGN KEY (author_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_2F84F8E9F675F31B ON maintenance (author_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE maintenance DROP CONSTRAINT fk_2f84f8e9f675f31b');
        $this->addSql('ALTER TABLE maintenance ADD CONSTRAINT fk_2f84f8e9f675f31b FOREIGN KEY (author_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('DROP INDEX IDX_2F84F8E9F675F31B');
        $this->addSql('ALTER TABLE maintenance DROP author_id');
    }
}
