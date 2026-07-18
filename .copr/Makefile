# Invoked by COPR's "make_srpm" SRPM build method: `make -f .copr/Makefile
# srpm outdir=... spec=...`. Plain rpmbuild -bs is enough here since the spec
# has no local Source files to stage, only a remote Source0 URL that rpmbuild
# fetches on its own (same as the "rpkg" build method already relies on).
srpm:
	rpmbuild --define "_srcrpmdir $(outdir)" -bs $(spec)
