import config from "@payload-config";
import { handleServerFunctions } from "@payloadcms/next/layouts";
import { importMap } from "../../importMap";

export const POST = async (req: Request) =>
  handleServerFunctions({ req, config, importMap });
