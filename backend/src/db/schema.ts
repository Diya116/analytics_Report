import {sqliteTable,text,integer} from "drizzle-orm/sqlite-core"

export const events=sqliteTable("events",{
    id:integer("id").primaryKey({autoIncrement:true}),
    timestamp:integer("timestamp",{mode:"number"}).notNull(),
    country:text("country").notNull(),
    device:text("device").notNull(),
    browser:text("browser").notNull(),
    referrer:text("referrer").notNull()
})