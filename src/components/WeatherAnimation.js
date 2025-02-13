import { useEffect, useState } from "react";
import Lottie from "lottie-react";

const WeatherAnimation = ({ weather }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const loadAnimation = async () => {
      if (!weather) return;

      let animationFile = null;

      if (weather.toLowerCase().includes("cloud")) {
        animationFile = "/assets/clouds.json"; // Absolute path to public folder
      } else if (weather.toLowerCase().includes("rain")) {
        animationFile = "/assets/rain.json";
      } else if (weather.toLowerCase().includes("snow")) {
        animationFile = "/assets/snow.json";
      }

      console.log("Fetching animation from:", animationFile);

      if (animationFile) {
        try {
          const response = await fetch(animationFile);
          const json = await response.json();
          setAnimationData(json);
        } catch (error) {
          console.error("Error loading animation JSON:", error);
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
