import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      const firebaseConfig = JSON.parse(process.env.FIREBASE_CREDENTIALS);

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  async verifyIdToken(token: string) {
    return this.firebaseApp.auth().verifyIdToken(token);
  }
}
