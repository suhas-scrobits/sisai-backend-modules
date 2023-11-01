import * as mqtt from "mqtt";

class MQTTService {
  mqttOptions = {
    clean: true, // retain session
    connectTimeout: 4000, // Timeout period
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  };

  connectUrl = process.env.MQTT_CONNECTION_URL || "";
  client = mqtt.connect(this.connectUrl, this.mqttOptions);

  initialize = () => {
    this.client.on("connect", () => {
      console.log("Connected to MQTT broker");
      const topicToSubscribe = "#";
      this.client.subscribe(topicToSubscribe, (error: Error) => {
        if (error) {
          console.error("Subscription error:", error);
        } else {
          console.log(`Subscribed to ${topicToSubscribe}`);
        }
      });
    });

    this.client.on("error", (error) => {
      console.error("Error:", error);
    });

    this.client.on("close", () => {
      console.log("Connection closed");
    });

    this.client.on("offline", () => {
      console.log("Client is offline");
    });
  };

  listenMqttEvents = async () => {
    this.client.on("message", async (topic, message) => {
      // perform operations here
    });
  };
}

export default MQTTService;
