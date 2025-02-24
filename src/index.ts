import { getInternalError } from "@verdaccio/commons-api";
import {
  AuthCallback,
  IPluginAuth,
  Logger,
  PluginOptions,
} from "@verdaccio/types";

import { NexusAuthProxyConfig } from "../types/index";

/**
 * Custom Verdaccio Authenticate Plugin.
 */
export default class NexusProxyAuthPlugin
  implements IPluginAuth<NexusAuthProxyConfig>
{
  public logger: Logger;
  private uri: string;
  public constructor(
    config: NexusAuthProxyConfig,
    options: PluginOptions<NexusAuthProxyConfig>
  ) {
    this.logger = options.logger;
    this.uri = config.uri;
    return this;
  }
  /**
   * Authenticate an user.
   * @param user user to log
   * @param password provided password
   * @param cb callback function
   */
  public authenticate(user: string, password: string, cb: AuthCallback): void {
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
