import {
  useState,
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from 'react';
import Router from 'next/router';
import {userResource} from '@resources/userResource';
import {authenticationResource} from '@resources/authenticationResource';
import {User} from 'interfaces/User';
import {
  getToken,
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken,
} from '../helpers';

type AuthenticationValues = {
  email: string;
  password: string;
};

interface AuthContextType {
  user: User | null;
  login: (data: AuthenticationValues) => Promise<boolean | null>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoadingFetchUser?: boolean;
  fetchUser: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
};

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
export const AuthProvider = ({children}: PropsWithChildren): JSX.Element => {
  const auth = useProviderAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAccount = ({
  redirectIfFound,
  redirectIfNotFound,
  redirectIfMailNotConfirm,
}: {
  redirectIfFound?: string;
  redirectIfNotFound?: string;
  redirectIfMailNotConfirm?: string;
}) => {
  const {user, isLoadingFetchUser} = useAuth();

  useEffect(() => {
    if (!isLoadingFetchUser && user && redirectIfFound) {
      Router.push(redirectIfFound);
    } else if (!isLoadingFetchUser && !user && redirectIfNotFound) {
      Router.push(redirectIfNotFound);
    } else if (
      !isLoadingFetchUser &&
      user &&
      !user.emailConfirmed &&
      redirectIfMailNotConfirm
    ) {
      Router.push(
        `/inscription?next=${encodeURIComponent(redirectIfMailNotConfirm)}`
      );
    }
  }, [
    redirectIfFound,
    redirectIfNotFound,
    user,
    isLoadingFetchUser,
    redirectIfMailNotConfirm,
  ]);

  return {user, isLoadingFetchUser};
};

// Provider hook that creates auth object and handles state
const useProviderAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingFetchUser, setLoadingFetchUser] = useState(true);

  const fetchUser = async (): Promise<User | null> => {
    const currentToken = getToken();

    if (currentToken) {
      const user = await userResource.getCurrent();
      setUser(user);
    }

    return user || null;
  };

  useEffect(() => {
    async function loadUserFromSession() {
      try {
        if (!!getToken()) {
          await fetchUser();
        }
      } catch (e) {
        await logout();
      } finally {
        setLoadingFetchUser(false);
      }
    }

    loadUserFromSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (data: {email: string; password: string}) => {
    try {
      const {token, refresh_token} = await authenticationResource.authenticate(
        data
      );
      setToken(token);
      setRefreshToken(refresh_token);
      fetchUser();

      return !!token;
    } catch (e) {
      return null;
    }
  };

  const logout = async () => {
    removeToken();
    removeRefreshToken();
    setUser(null);
  };

  return {
    user,
    setUser,
    login,
    logout,
    isAuthenticated: !!user,
    isLoadingFetchUser,
    fetchUser,
  };
};
