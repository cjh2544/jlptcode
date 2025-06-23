import { NextAuthOptions } from 'next-auth'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/app/models/userModel'
import connectDB from '@/app/utils/database'
import bcrypt from "bcrypt";
import UserPayment from '@/app/models/userPaymentModel'

const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS as string;

export const options: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_SECRET as string,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID as string,
      clientSecret: process.env.NAVER_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "로그인",
      credentials: {
        email: {
          label: "이메일",
          type: "email",
          placeholder: "name@company.com",
        },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
          provider: 'credentials'
        });

        if (!user) {
          throw new Error("회원정보가 없습니다.");
        }

        const isMatch = await bcrypt.compareSync(
          credentials.password,
          user.password
        );

        if (!isMatch) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        return user;
      },
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if(account?.type === 'oauth') {
        return await signInWithOAuth({ user, account, profile });
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, user, token }) {
      if(session.user) session.user.role = token.role;

      // 결제 정보 조회
      const userPayment = await UserPayment.aggregate([
        {
          $match: { email: token.email }
        },
        {
          $unwind: {
            path: "$payments",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            "payments.isValid": {
              $cond: {
                if: {
                  $and: [
                    { $lte: ["$payments.startDate", new Date()] },
                    { $gte: ["$payments.endDate", new Date()] }
                  ]
                },
                then: true,
                else: false
              }
            }
          }
        },
        {
          $match: {
            "payments.isValid": true
          }
        },
        {
          $sort: {
            "payments.endDate": -1
          }
        },
        {
          $limit: 1
        },
        {
          $project: {
            _id: 0,
            email: 1,
            startDate: "$payments.startDate",
            endDate: "$payments.endDate",
            createdAt: "$payments.createdAt",
            updatedAt: "$payments.updatedAt",
            isValid: "$payments.isValid"
          }
        }
      ]);

      session.paymentInfo = userPayment[0];

      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/signin', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/singup' // New users will be directed here on first sign in (leave the property out if not of interest)
  }
}

const signInWithOAuth = async ({ user, account, profile }: { user: any, account: any, profile: any}) => {
  console.log({ user, account, profile });

  let newUser = new User();

  if(account.provider === 'kakao') {
    newUser = new User({
      name: user?.name ,
      email: user?.email,
      image: user?.image,
      provider: account.provider,
    })
  }

  if(account.provider === 'naver') {
    newUser = new User({
      name: profile?.response?.name ,
      email: profile?.response?.email,
      image: profile?.response?.profile_image,
      provider: account.provider,
    })
  }

  if(account.provider === 'google') {
    newUser = new User({
      name: profile?.name ,
      email: profile?.email,
      image: profile?.picture,
      provider: account.provider,
    })
  }

  await connectDB();

  const userData = await User.findOne({ email: newUser.email });
  
  if(userData) return true;
  
  await newUser.save();

  return true;
}

const getUserByEmail = async ({ email }: { email: string }) => {
  await connectDB();
    
  const user = await User.findOne({ email }).select('-password');

  return user;
}
