/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export interface Env{

}
export default {
	async fetch(request:Request, env:Env, ctx): Promise<Response> {

		const url=request.url;
		// console.log(request.headers);
		// // const data=await request.json();
		// const country=request.headers.get("CF-IPCountry") || "XX";
		//   if(request.method==="GET")
		// {
        //    return Response.json(request.headers)
		// }

        // if(request.method==="GET")
		// {
        //    return Response.json({
		// 	"message":"you sent get request"
		// })
		// }

		return  Response.json({"url":url});
	},
} satisfies ExportedHandler<Env>;
