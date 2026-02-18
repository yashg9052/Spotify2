import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast, { Toaster } from "react-hot-toast";

const server = "http://localhost:5000";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  playlist: string[];
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  loginUser: (
    email: string,
    password: string,
    navigate: (path: string) => void,
  ) => Promise<void>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void,
  ) => Promise<void>;
  logoutUser: () => Promise<void>;
  addToPlaylist: (id: string) => Promise<void>;

  btnLoading: boolean;
}

type UserProviderProps = {
  children: ReactNode;
};
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  async function registerUser(
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void,
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoading(false);
    }
  }

  const loginUser = async (
    email: string,
    password: string,
    navigate: (path: string) => void,
  ) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/login`, {
        email,
        password,
      });
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoading(false);
    }
  };
  async function addToPlaylist(id: string) {
    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

      toast.success(data.message);
      fetchUser();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
    }
  }
  async function logoutUser() {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);

    toast.success("User Logged Out");
  }
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <UserContext.Provider
        value={{
          user,
          loading,
          isAuth,
          loginUser,
          registerUser,
          logoutUser,
          btnLoading,
          addToPlaylist,
        }}
      >
        {children}
        <Toaster />
      </UserContext.Provider>
    </>
  );
};
export const useUserdata = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("Use Userdata must be used within provider");
  }
  return context;
};
