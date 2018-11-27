import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class ConfigService {
    // ***************************************************************************
    // Attributes
    // ***************************************************************************

    private readonly envConfig: { [key: string]: string };

    // ***************************************************************************
    // Constructor
    // ***************************************************************************
    constructor() {
        try {
            this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '.env')));
        } catch (e) {
            this.envConfig = {};
        }
        this.initFirebase();
    }

    // ***************************************************************************
    // Public methods
    // ***************************************************************************
    get(key: string): string {
        return this.envConfig[key] || process.env[key];
    }

    // ***************************************************************************
    // Private methods
    // ***************************************************************************
    private initFirebase() {
        const service = {
            type: this.get('FIRE_TYPE'),
            project_id: this.get('FIRE_PROJECT_ID'),
            private_key_id: this.get('FIRE_PRIVATE_KEY_ID'),
            private_key: this.get('FIRE_PRIVATE_KEY'),
            client_email: this.get('FIRE_CLIENT_EMAIL'),
            client_id: this.get('FIRE_CLIENT_ID'),
            auth_uri: this.get('FIRE_AUTH_URI'),
            token_uri: this.get('FIRE_TOKEN_URI'),
            auth_provider_x509_cert_url: this.get('FIRE_AUTH_PROVIDER_X509_CERT_URL'),
            client_x509_cert_url: this.get('FIRE_CLIENT_X509_CERT_URL'),
        };
        admin.initializeApp({
            credential: admin.credential.cert(service as any),
            databaseURL: 'https://pay-integration.firebaseio.com',
        });
        admin.firestore().settings({ timestampsInSnapshots: true });
    }
}
