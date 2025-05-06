import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/ApiConfig";
import SettingSection from "./SettingSection";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      setProfile(response.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <SettingSection icon={User} title={"Profile"}>
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">Error loading profile.</p>}
      {!loading && !error && profile && (
        <>
          <div className="flex flex-col sm:flex-row items-center mb-6">
            <img
              src={
                profile.avatar ||
                "https://randomuser.me/api/portraits/men/3.jpg"
              }
              alt="Profile"
              className="rounded-full w-20 h-20 object-cover mr-4"
            />

            <div>
              <h3 className="text-lg font-semibold text-gray-100">
                {profile.name}
              </h3>
              <p className="text-gray-400">{profile.email}</p>
            </div>
          </div>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
            onClick={() => navigate("user/edit")}
          >
            Edit Profile
          </button>
        </>
      )}
    </SettingSection>
  );
};

export default Profile;
