import { initializeApp } from 'firebase/app';
import { getConfig } from '../config';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithCustomToken,
  User,
} from 'firebase/auth';

let app: any = null;
export class FirebaseUserService {
  static async initializeApp() {
    let firebaseConfig: {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
    };
    const config = getConfig();
    const env = config.env || 'development';
    try {
      firebaseConfig = require(
        `../../service-accounts/user-${env}.json`,
      );
      if (firebaseConfig) {
        app = initializeApp(firebaseConfig);
      }
    } catch (error) {
      throw error;
    }
  }

  static async getAuth() {
    if (!app) {
      throw new Error(
        'Firebase app is not initialized. Call initializeApp first.',
      );
    }
    return getAuth(app);
  }

  static async signInWithEmailAndPassword(
    email: string,
    password: string,
  ) {
    const auth = await this.getAuth();
    return signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
  }

  static async createUserWithEmailAndPassword(
    email: string,
    password: string,
  ) {
    const auth = await this.getAuth();
    const createdUser =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
    sendEmailVerification(createdUser.user);
    return createdUser;
  }
  static async signinWithCustomToken(userToken: string) {
    const auth = await this.getAuth();
    return signInWithCustomToken(auth, userToken);
  }
  static async sendVerificationEmail(user: User) {
    return sendEmailVerification(user);
  }
}
