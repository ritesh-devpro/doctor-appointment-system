import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { api } from "../api/client";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);


  useEffect(() => {
    loadDoctors();

    if (token) {
      fetchMe();
    }
  }, [token]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          const url = error.config?.url || "";

          
          if (!url.includes("/auth/login") && !url.includes("/auth/signup")) {
            console.warn("Session expired");

            if (token) {
              clearAuth();
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [token]);

  const persistAuth = (data) => {
    setToken(data.token);
    setUser(data.user);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };


  const signup = async (payload) => {
    try {
      const { data } = await api.post("/auth/signup", payload);
      persistAuth(data);
      return data;
    } catch (error) {
      throw error.response?.data || { message: "Signup failed" };
    }
  };


  const login = async (payload) => {
    try {
      const { data } = await api.post("/auth/login", payload);
      persistAuth(data);
      return data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  };

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      clearAuth();
    }
  };

  const loadDoctors = async () => {
    try {
      setLoading(true);

      const [{ data: all }, { data: top }] = await Promise.all([
        api.get("/patient/doctors"),
        api.get("/patient/doctors/top"),
      ]);

      setDoctors(all.doctors);
      setTopDoctors(top.doctors);
    } catch (error) {
      setDoctors([]);
      setTopDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorSlots = async (doctorId) => {
    try {
      const { data } = await api.get(`/patient/doctors/${doctorId}/slots`);
      return data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch slots" };
    }
  };

  const bookAppointment = async (payload) => {
    try {
      const { data } = await api.post("/patient/appointments", payload);
      return data;
    } catch (error) {
      throw error.response?.data || { message: "Booking failed" };
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const { data } = await api.get("/patient/appointments/my");
      return data.appointments;
    } catch (error) {
      throw error.response?.data || {
        message: "Failed to fetch appointments",
      };
    }
  };

  const cancelPatientAppointment = async (appointmentId) => {
    try {
      const { data } = await api.patch(
        `/patient/appointments/${appointmentId}/cancel`
      );
      return data;
    } catch (error) {
      throw error.response?.data || { message: "Cancel failed" };
    }
  };

  const payForAppointment = async (appointmentId) => {
    try {
      const { data } = await api.patch(
        `/patient/appointments/${appointmentId}/pay`
      );
      return data;
    } catch (error) {
      throw error.response?.data || { message: "Payment failed" };
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      doctors,
      topDoctors,
      loading,
      setLoading,
      signup,
      login,
      fetchMe,
      clearAuth,
      loadDoctors,
      fetchDoctorSlots,
      bookAppointment,
      fetchMyAppointments,
      cancelPatientAppointment,
      payForAppointment,
    }),
    [token, user, doctors, topDoctors, loading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
};