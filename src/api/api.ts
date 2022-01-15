import axios, { AxiosPromise } from "axios";

import { backendUrl, backendTimeoutMs } from "../config.json";
import { ShowViewModel } from "./show";
import pick from "lodash-es/pick";
import store from "../redux/store";
import { addNotification } from "../redux/actions";
import { BeevenueNotificationTemplate } from "../notifications/index";
import { SimilarityData } from "./similarity";
import { ImplicationData } from "./implications";
import {
  LoginParameters,
  PaginationParameters,
  SearchParameters,
  UpdateMediumParameters,
} from "./parameterTypes";
import { Rule } from "rules/ruleText";

const axiosClient = axios.create({
  baseURL: `${backendUrl}/`,
  timeout: backendTimeoutMs,
  withCredentials: true,
});

export interface SummaryRule {
  definition: Rule;
  adherence: number;
}

export type QuickFixKind = "addTag" | "addAbsentTag";

export interface QuickFix {
  kind: QuickFixKind;
  tag: string;
}

export interface ViolationViewModel {
  fixes: QuickFix[];
  text: string;
}

interface ViolationsViewModel {
  violations: ViolationViewModel[];
}

const dispatcher = (x: any) => {
  if ((x as BeevenueNotificationTemplate).level) {
    store.dispatch(addNotification(x));
  }
};

const _notification_wrapper = (p: AxiosPromise<any>): AxiosPromise<any> => {
  return new Promise((resolve, reject) => {
    p.then(
      (success) => {
        dispatcher(success.data);
        resolve(success);
      },
      (error) => {
        if (error.response) {
          dispatcher(error.response.data);
        }
        reject(error);
      }
    );
  });
};

const Api = {
  Medium: {
    delete(id: number): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.delete(`medium/${id}`));
    },
    generateThumbnailPicks(mediumId: number): AxiosPromise<any> {
      return axiosClient.get(`medium/${mediumId}/thumbnail/picks`);
    },
    load(params: PaginationParameters): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get(`media`, { params }));
    },
    regenerateThumbnail(mediumId: number): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.patch(`thumbnail/${mediumId}`));
    },
    replace(mediumId: number, file: File): AxiosPromise<any> {
      const fd = new FormData();
      fd.append("file", file);
      return _notification_wrapper(
        axiosClient.patch(`medium/${mediumId}/file`, fd, {
          // This could potentially take a really long time. Turn off timeouts
          // completely for this request.
          timeout: 0,
        })
      );
    },
    requestOtp(mediumId: number): AxiosPromise<string> {
      return axiosClient.post(`medium/${mediumId}/otp`);
    },
    search(searchParams: SearchParameters): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.get("search", { params: searchParams })
      );
    },
    selectThumbnailPick(mediumId: number, i: number): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.patch(`medium/${mediumId}/thumbnail/pick/${i}`)
      );
    },
    show(id: number): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get(`medium/${id}`));
    },
    update(params: UpdateMediumParameters): AxiosPromise<ShowViewModel> {
      return _notification_wrapper(
        axiosClient.patch(
          `medium/${params.id}/metadata`,
          pick(params, ["rating", "absentTags", "tags"])
        )
      );
    },
    upload(file: File): AxiosPromise<any> {
      const fd = new FormData();
      fd.append("file", file);
      return _notification_wrapper(
        axiosClient.post("medium", fd, {
          // This could potentially take a really long time. Turn off timeouts
          // completely for this request.
          timeout: 0,
        })
      );
    },
  },

  Tags: {
    addAlias(tag: string, alias: string): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.post(`tag/${tag}/aliases/${alias}`)
      );
    },

    addImplication(
      implying_this: string,
      implied_by_this: string
    ): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.patch(
          `tag/${implying_this}/implications/${implied_by_this}`
        )
      );
    },

    batchAdd(
      isAbsent: boolean,
      tags: string[],
      mediumIds: number[]
    ): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.post(`tags/batch`, { isAbsent, tags, mediumIds })
      );
    },

    getAnyMissing(): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get(`tags/missing/any`));
    },

    getImplications(): AxiosPromise<ImplicationData> {
      return axiosClient.get("tags/implications");
    },

    getSimilarity(): AxiosPromise<SimilarityData> {
      return axiosClient.get("tags/similarity");
    },

    getSummary(): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get("tags"));
    },

    getViolations(mediumId: number): AxiosPromise<ViolationsViewModel> {
      return _notification_wrapper(axiosClient.get(`tags/missing/${mediumId}`));
    },

    patch(name: string, body: object): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.patch(`tag/${name}`, body));
    },

    removeAlias(tag: string, alias: string): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.delete(`tag/${tag}/aliases/${alias}`)
      );
    },

    removeImplication(
      implying_this: string,
      implied_by_this: string
    ): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.delete(
          `tag/${implying_this}/implications/${implied_by_this}`
        )
      );
    },

    show(name: string): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get(`tag/${name}`));
    },
  },

  Rules: {
    getSummary(): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get(`rules/summary`));
    },

    delete(index: number): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.delete(`rules/${index}`));
    },

    validateJson(json: any): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.post(`rules/validation`, json));
    },

    uploadJson(json: any): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.post(`rules`, json));
    },
  },

  Session: {
    amILoggedIn(): AxiosPromise<any> {
      return axiosClient.get("login");
    },

    connectGoogleAccount(googleJWT: string): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.post("connectGoogleAccount", { googleJWT })
      );
    },

    login(data: LoginParameters): AxiosPromise<any> {
      return axiosClient.post("login", data);
    },

    loginWithGoogle(googleJWT: string): AxiosPromise<any> {
      return axiosClient.post("loginWithGoogle", { googleJWT });
    },

    logout(): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.post("logout"));
    },

    setSfw(sfw: boolean): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.patch("sfw", { sfwSession: sfw })
      );
    },
  },

  Stats: {
    get(): AxiosPromise<any> {
      return axiosClient.get("stats");
    },
  },
};

export { Api };
