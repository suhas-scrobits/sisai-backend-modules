import NodeGeocoder from "node-geocoder";
import { AddressType, Client } from "@googlemaps/google-maps-services-js";

type Device = {
  latitude: string;
  longitude: string;
};

class GeocodingService {
  options: NodeGeocoder.Options = {
    provider: "openstreetmap", // You can choose different providers like Google Maps or others
  };

  geocoder = NodeGeocoder(this.options);

  googleMapsClient = new Client({});

  getCityName = async (lat: string, lang: string) => {
    try {
      const req = {
        params: {
          latlng: `${lat},${lang}`,
          key: process.env.GOOGLE_MAP_KEY || "", // Replace with your API key
        },
        timeout: 1000, // milliseconds
      };

      const response = await this.googleMapsClient.reverseGeocode(req);
      const city = response.data.results[0].address_components.find((comp) =>
        comp.types.includes(AddressType.locality)
      )?.long_name;

      return { name: city, latitude: lat, longitude: lang };
    } catch (error) {
      throw new Error(`Error while geocoding: ${error.message}`);
    }
  };

  removeDuplicateCoordinates = (devices: Device[]) => {
    const uniqueCoordinates = new Set<string>();
    const uniqueDevices: Device[] = [];

    devices.forEach((device) => {
      const coordinateKey = `${device.latitude},${device.longitude}`;
      if (!uniqueCoordinates.has(coordinateKey)) {
        uniqueCoordinates.add(coordinateKey);
        uniqueDevices.push(device);
      }
    });

    return uniqueDevices;
  };

  getUniqueCities = async (devices: Device[]) => {
    const uniqueLocationDevices = this.removeDuplicateCoordinates(devices);

    const citiesPromises = uniqueLocationDevices.map(async (device) => {
      if (device.latitude && device.longitude) {
        const city = await this.getCityName(device.latitude, device.longitude);
        return city; // Return an empty string if city is undefined
      }
    });

    const cities = await Promise.all(citiesPromises);

    const uniqueCities = new Set();

    const uniqueDevicesArray = cities.filter((city) => {
      if (city?.name !== "") {
        // Filter out empty strings
        if (!uniqueCities.has(city?.name)) {
          uniqueCities.add(city?.name);
          return true;
        }
      }
      return false;
    });

    return uniqueDevicesArray.filter((city) => city?.name);
  };
}

export default GeocodingService;
