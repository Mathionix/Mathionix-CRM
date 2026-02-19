"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function audit() {
    console.log('--- Deep Database Audit ---');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const mongoose = require('mongoose');
        const db = mongoose.connection;
        const collections = ['users', 'clients', 'contacts', 'leads', 'deals'];
        for (const colName of collections) {
            console.log(`Checking "${colName}"...`);
            const docs = await db.collection(colName).find({}).toArray();
            let issues = 0;
            for (const doc of docs) {
                const fields = ['organization', 'roleId', 'assignedTo', 'lead', 'client'];
                for (const field of fields) {
                    if (doc[field] === "") {
                        console.log(`[Issue] ${colName} ${doc._id}: Field "${field}" is empty string`);
                        issues++;
                    }
                    else if (Array.isArray(doc[field])) {
                        if (doc[field].includes("")) {
                            console.log(`[Issue] ${colName} ${doc._id}: Array "${field}" contains empty string`);
                            issues++;
                        }
                    }
                }
            }
            console.log(`Summary for ${colName}: Found ${issues} issues.`);
            if (issues > 0) {
                console.log(`Cleaning "${colName}"...`);
                await db.collection(colName).updateMany({ organization: "" }, { $unset: { organization: 1 } });
                await db.collection(colName).updateMany({ roleId: "" }, { $unset: { roleId: 1 } });
                await db.collection(colName).updateMany({ lead: "" }, { $unset: { lead: 1 } });
            }
        }
    }
    catch (e) {
        console.error('Audit failed:', e);
    }
    finally {
        await app.close();
        process.exit(0);
    }
}
audit();
//# sourceMappingURL=deep-audit.js.map