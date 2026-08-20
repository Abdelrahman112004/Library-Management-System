CREATE TYPE "public"."item_kind" AS ENUM('book', 'journal', 'magazine', 'newspaper');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "authors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"address" text NOT NULL,
	"phone_number" text NOT NULL,
	"student" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" integer PRIMARY KEY NOT NULL,
	"kind" "item_kind" NOT NULL,
	"title" text NOT NULL,
	"author_id" integer NOT NULL,
	"price" double precision NOT NULL,
	"pages" integer NOT NULL,
	"due_days" integer NOT NULL,
	"publishing_date" date NOT NULL,
	"isbn" text,
	"genre" text,
	"description" text,
	"publication_frequency" text,
	"impact_factor" double precision,
	"issue_number" integer,
	"issue_language" text
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"item_id" integer NOT NULL,
	"check_out_date" date NOT NULL,
	"check_in_date" date,
	"printing" boolean DEFAULT false NOT NULL,
	"printing_cost_per_page" double precision,
	"proof_reading" boolean DEFAULT false NOT NULL,
	"proof_reading_cost_per_page" double precision
);
--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE restrict ON UPDATE no action;