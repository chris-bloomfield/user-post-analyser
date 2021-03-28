A utility to visualise users and their posting topic habits based on sample GraphQL data.

## Design choices

I built the site using the [Next.js](https://nextjs.org/) framework - partly because of past familiarity with it, and also because it is a able to render the data quickly as a static page, while revalidating it on the sever-side for future requests - a good combination of static-rendering speed and up-to-date data fetching that would suit this use-case.

For the GraphQL fetching I used `graphql-request` since this is a simple tool that is adequate for fetching the required data.  Would consider replacing with Apollo if the site grew to contain data that neeeded to be cached / updated during the user's visit.

The data visualisation is a visx stacked bar graph since this provided a good way of visualising the breakdown of a user's posts that accounted for the weighted nature of the data, as well as taking advantage of the fact that there are a set number of post categories.

## Challenges

Visx is still a fairly new library to me, so the first challenge was finding my way round the examples and documentation in order to create the visualisation I had in mind.  Transforming the GraphQL data into a format usable by the Visx components was also an interesting challenge - and probably somewhere that I'd look to make the code a little easier to understand if I was to continue working on this.

One thought on the API would be that the `createdAt` dates would be easier to work with (and easier to read at a glance while looking at the GraphQL data) if they were in ISO format.  Also the [uifaces](https://uifaces.com/) image set used for the user avatars seem to have been taken offline.


## To run locally

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.
