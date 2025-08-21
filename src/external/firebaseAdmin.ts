import * as admin from 'firebase-admin';
import { getConfig } from '../config';

export class FirebaseAdminService {
  static async initializeApp() {
    let serviceAccount: {
      type: string;
      project_id: string;
      private_key_id: string;
      private_key: string;
      client_email: string;
      client_id: string;
      auth_uri: string;
      token_uri: string;
      auth_provider_x509_cert_url: string;
      client_x509_cert_url: string;
      universe_domain: string;
    };
    const config = getConfig();
    const env = config.env || 'development';
    try {
      serviceAccount = require(
        `../../service-accounts/admin-${env}.json`,
      );
      if (serviceAccount) {
        await admin.initializeApp({
          credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount,
          ),
          databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
        });
      }
    } catch (error) {
      if (env === 'test') {
        return;
      }

      throw error;
    }
  }

  static async getAuth() {
    return admin.auth();
  }
}
