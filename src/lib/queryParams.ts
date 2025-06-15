export const appendQueryParams = (
 params: Record<string, string | number | boolean>
) => {
 const queryParams = new URLSearchParams();
 Object.entries(params).forEach(([key, value]) => {
  queryParams.append(key, value.toString());
 });
 return queryParams.toString();
};
