<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230606144112 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create messages tables';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE discussion_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE discussion_message_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE discussion (id INT NOT NULL, repairer_id INT NOT NULL, customer_id INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C0B9F90F47C5DFEE ON discussion (repairer_id)');
        $this->addSql('CREATE INDEX IDX_C0B9F90F9395C3F3 ON discussion (customer_id)');
        $this->addSql('COMMENT ON COLUMN discussion.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE discussion_message (id INT NOT NULL, discussion_id INT NOT NULL, sender_id INT NOT NULL, content VARCHAR(1000) NOT NULL, already_read BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_3EE316C21ADED311 ON discussion_message (discussion_id)');
        $this->addSql('CREATE INDEX IDX_3EE316C2F624B39D ON discussion_message (sender_id)');
        $this->addSql('COMMENT ON COLUMN discussion_message.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE discussion ADD CONSTRAINT FK_C0B9F90F47C5DFEE FOREIGN KEY (repairer_id) REFERENCES repairer (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE discussion ADD CONSTRAINT FK_C0B9F90F9395C3F3 FOREIGN KEY (customer_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE discussion_message ADD CONSTRAINT FK_3EE316C21ADED311 FOREIGN KEY (discussion_id) REFERENCES discussion (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE discussion_message ADD CONSTRAINT FK_3EE316C2F624B39D FOREIGN KEY (sender_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE discussion_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE discussion_message_id_seq CASCADE');
        $this->addSql('ALTER TABLE discussion DROP CONSTRAINT FK_C0B9F90F47C5DFEE');
        $this->addSql('ALTER TABLE discussion DROP CONSTRAINT FK_C0B9F90F9395C3F3');
        $this->addSql('ALTER TABLE discussion_message DROP CONSTRAINT FK_3EE316C21ADED311');
        $this->addSql('ALTER TABLE discussion_message DROP CONSTRAINT FK_3EE316C2F624B39D');
        $this->addSql('DROP TABLE discussion');
        $this->addSql('DROP TABLE discussion_message');
    }
}
