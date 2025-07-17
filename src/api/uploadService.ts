interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
}

interface PresignedUrlResponse {
  uploadUrl: string;
  imageUrl: string;
}

export const getPresignedUrl = async (
  fileName: string,
  fileType: string
): Promise<PresignedUrlResponse> => {
  const apiGatewayEndpoint = import.meta.env.VITE_API_GATEWAY_ENDPOINT;

  if (!apiGatewayEndpoint) {
    throw new Error(
      "VITE_API_GATEWAY_ENDPOINT environment variable is not set"
    );
  }

  const requestBody: PresignedUrlRequest = {
    fileName,
    fileType,
  };

  try {
    const response = await fetch(apiGatewayEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(
        `API Gateway request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: PresignedUrlResponse = await response.json();

    if (!data.uploadUrl || !data.imageUrl) {
      throw new Error(
        "Invalid response from API Gateway - missing uploadUrl or imageUrl"
      );
    }

    return data;
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    throw error;
  }
};
