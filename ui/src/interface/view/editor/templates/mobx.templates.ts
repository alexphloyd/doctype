export const MOBX_TEMPLATE = `<h1>Learn Mobx</h1><p>[observer] does not observe values in async</p><p>[observable] possible to use Map, Set.</p><pre><code>const twitterUrls = observable.map({
  Joe: "twitter.com/joey"
});

autorun(() =&gt; {
  console.log(twitterUrls.get("Sara"))
});

runInAction(() =&gt; {
  twitterUrls.set("Sara", "twitter.com/horsejs")
});</code></pre><p>[Proxy] added to chrome & safari in 2016</p><p>[structure] makeObservable configurable to ignore specific properties.</p><pre><code>makeObservable(this, {
  count: observable,
  total: computed
});</code></pre>
`;
