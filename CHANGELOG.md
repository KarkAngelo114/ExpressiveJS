# CHANGELOG

# v1.0.4
### Changes and Updates
- the core integrative AI Endpoint wrapper module now uses Groq services. Changed from using `Apifreellm` to `Groq`. API key to use must be obtain from `https://groq.com/`. If your app still relies on Apifreellm after this update, ensure you change your keys.


# v1.0.3
### Updates
- updated session config scripts

### Added modules
- added an auth middleware


# v1.0.2
### Changes and updates
- updated session config files (now uses SESSION_SECRET)
- updated auth.js (removed old API_AUTH.js middleware)

### Deleted files
- removed old API_AUTH.js middleware


# v1.0.2
### Changes and Updates
- CORS module has commented option
- Integrative AI core module now exports object, not a singleton class anymore
- You can now set API key via configure() when configuring your IntegrativeAI module.
- Querex query builder is now exported as a class, not a singleton anymore. Therefore, you need to do `new Querex()....` before doing any method chaining in building your query.
- App.js has a minor update.

### Added modules
- added an `http` module where in you can now centralized making request without the need of writing `fetch` blocks everywhere and don't need to parse response manually as it is already done in the module.