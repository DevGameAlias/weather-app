import { useEffect, useState } from "react";
import Lottie from "lottie-react";

const WeatherAnimation = ({ weather }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const loadAnimation = async () => {
      if (!weather) return;

      let animationFile = null;

      if (weather.toLowerCase().includes("cloud")) {
        animationFile = "/assets/clouds.json"; // ✅ Fetch from public/assets/
      }

      if (animationFile) {
        try {
          const response = await fetch(animationFile);
          if (!response.ok) throw new Error("Failed to load animation");
          const json = await response.json();
          setAnimationData(json);
        } catch (error) {
          console.error("Error loading animation:", error);
        }
      }
    };

    loadAnimation();
  }, [weather]);

  return animationData ? (
    <Lottie animationData={animationData} className="w-48 h-48" />
  ) : null;
};

export default WeatherAnimation;
