import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import scoreService from "../services/scoreService";
import { validateData } from "../utils/validateData";
import scoreValidation from "../validations/scoreValidation";
