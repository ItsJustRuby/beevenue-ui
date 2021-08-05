import { makeNotificationContent } from "./impl";

export type BeevenueNotificationId = string;

export type BeevenueNotificationLevel = "error" | "warning" | "info";

export interface BeevenueNotificationTemplate {
  level: BeevenueNotificationLevel;
  contents: NotificationContentModel[];
}

export interface BeevenueNotification {
  id: BeevenueNotificationId;

  level: BeevenueNotificationLevel;

  timestamp: Date;

  content: JSX.Element;
}

export interface BeevenueNotificationMap {
  [K: string]: BeevenueNotification;
}

type FlatTextModel = string;

export type NotificationContentModel = TextModel | FlatTextModel | LinkModel;

export interface TextModel {
  type: "text";
  data: string;
}

export interface LinkData {
  location: string;
  text: string;
}

export interface LinkModel {
  type: "link";
  data: LinkData;
}

export const makeNotificationFromTemplate = (
  t: BeevenueNotificationTemplate
): BeevenueNotification => {
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const id = `notification-${getRandomInt(1024 * 1024)}`;

  return {
    id,
    level: t.level,
    content: makeNotificationContent(t.contents),
    timestamp: new Date(),
  };
};
