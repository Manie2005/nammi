import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(
            path.join(__dirname, '../secret/hackathon-fafa5-firebase-adminsdk-fbsvc-ad8c0a2103.json')

        ),
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  async verifyIdToken(token: string) {
    return this.firebaseApp.auth().verifyIdToken(token);
  }
}
