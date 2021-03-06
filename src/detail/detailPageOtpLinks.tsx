import CONFIG from "../config";
import { MimeType } from "./media";

interface DetailPageOtpButtonsProps {
  id: number;
  mimeType: MimeType;
}

const PAGES = {
  IQDB: "https://iqdb.org/?url=",
  Google: "https://www.google.com/searchbyimage?safe=off&image_url=",
  SauceNao: "https://saucenao.com/search.php?url=",
  "trace.moe": "https://trace.moe/?auto&url=",
};

const DetailPageOtpLinks = (props: DetailPageOtpButtonsProps) => {
  if (props.mimeType.startsWith("video/")) {
    return null;
  }

  const url = (target: string) => {
    return `${CONFIG.backendUrl}/medium/${
      props.id
    }/otp?target=${encodeURIComponent(target)}`;
  };

  return (
    <div className="card beevenue-ShowPage-Card">
      <div className="card-content">
        <div className="buttons has-addons">
          {Object.entries(PAGES).map(([n, target], idx) => {
            return (
              <button className="button" key={idx}>
                <a className="beevenue-OtpLinks-OtpLink" href={url(target)}>
                  {n}
                </a>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { DetailPageOtpLinks };
