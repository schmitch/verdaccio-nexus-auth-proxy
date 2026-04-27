import { timingSafeEqual } from "crypto";

import { getInternalError } from "@verdaccio/commons-api";
import {
  AuthCallback,
  IPluginAuth,
  Logger,
  PluginOptions,
} from "@verdaccio/types";

import { NexusAuthProxyConfig } from "../types/index";

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

/**
 * Custom Verdaccio Authenticate Plugin.
 */
export default class NexusProxyAuthPlugin
  implements IPluginAuth<NexusAuthProxyConfig>
{
  public logger: Logger;
  private uri: string;
  private staticUser: string | undefined;
  private staticPassword: string | undefined;
  public constructor(
    config: NexusAuthProxyConfig,
    options: PluginOptions<NexusAuthProxyConfig>
  ) {
    this.logger = options.logger;
    this.uri = config.uri;
    this.staticUser = process.env.NEXUS_PROXY_STATIC_USER;
    this.staticPassword = process.env.NEXUS_PROXY_STATIC_PASSWORD;
    return this;
  }
  /**
   * Authenticate an user.
   * @param user user to log
   * @param password provided password
   * @param cb callback function
   */
  public authenticate(user: string, password: string, cb: AuthCallback): void {
    if (
      this.staticUser &&
      this.staticPassword &&
      user === this.staticUser &&
      safeEqual(password, this.staticPassword)
    ) {
      this.logger.debug({ name: user }, "static auth fast path for @{name}");
      cb(null, [user]);
      return;
    }
    this.logger.debug({ uri: this.uri }, "authenticating via @{uri}");
    fetch(`${this.uri}/service/rest/v1/status`, {
      headers: { Authorization: "Basic " + Buffer.from(user + ":" + password).toString("base64") },
    })
      .then((response) => {
        if (response.ok) {
          cb(null, [user]);
        } else {
          this.logger.error({ name: user }, "error @{name}");
          cb(getInternalError("error, try again"), false);
        }
      })
      .catch((error) => {
        this.logger.error({ name: user }, "error @{name}");
        cb(getInternalError("error, try again"), false);
      });
  }
}
