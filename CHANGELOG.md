# CHANGELOG

# v1.0.2
### Changes and Updates
- CORS module has commented option
- Integrative AI core module now exports object, not a singleton class anymore
- You can now set API key via configure() when configuring your IntegrativeAI module.
- Querex query builder is now exported as a class, not a singleton anymore. Therefore, you need to do `new Querex()....` before doing any method chaining in building your query.
- App.js has a minor update.

### Added modules
- added an `http` module where in you can now centralized making request without the need of writing `fetch` blocks everywhere and don't need to parse response manually as it is already done in the module.