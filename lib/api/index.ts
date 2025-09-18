// Central export for all API services
export { api, endpoints } from "@/lib/api-client";
export { authService } from "./auth.service";
export { claimsService, type CreateClaimRequest } from "./claims.service";
export { geographicService } from "./geographic.service";
export { s3Service } from "./s3.service";
export { documentService } from "./document.service";
export { analysisService } from "./analysis.service";
export { adminService } from "./admin.service";

// Re-export types
export * from "@/lib/types/api";
export * from "@/lib/types/claim-form";
