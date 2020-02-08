# [1.5.0](https://github.com/ahmadalfy/gitlab-explorer/compare/v1.4.0...v1.5.0) (2020-02-08)


### Bug Fixes

* **Commit:** Display deleted fiiles as deleted ([815faba](https://github.com/ahmadalfy/gitlab-explorer/commit/815fabafd54f563764a5aea5f2faa553ae17ce4b))
* **Commit:** Wrong reference to `this` ([6500da7](https://github.com/ahmadalfy/gitlab-explorer/commit/6500da7e2c707ada44bfe54ab62b1af5a66124ac))
* **projects:** Get projects based on last activity ([2c595a8](https://github.com/ahmadalfy/gitlab-explorer/commit/2c595a82eca6334d0fc534f7dc4cfcf21e827580))


### Features

* Get member's new events only ([9ebdd02](https://github.com/ahmadalfy/gitlab-explorer/commit/9ebdd02f210dceeba982efd6de7ba91839a173bb))
* Requests now grab all available data ([3fe7a7b](https://github.com/ahmadalfy/gitlab-explorer/commit/3fe7a7bb888c910d889337483fb6ff4c1e47134e))
* **Charts:** Add callback to chart drawing ([a197430](https://github.com/ahmadalfy/gitlab-explorer/commit/a1974303b0c079a481697e9e00a84060073025ff))
* **Commit:** Display diff between 2 commits ([5302713](https://github.com/ahmadalfy/gitlab-explorer/commit/53027136b19734f81b86aea558bfe52af9f677f6))
* **Commits:** Draw commits in a separate panel ([f6d56f4](https://github.com/ahmadalfy/gitlab-explorer/commit/f6d56f4cb0639cf647871288350851bab6738d63))
* Add query strings to the request utility ([ec24931](https://github.com/ahmadalfy/gitlab-explorer/commit/ec24931e5c1579f12ba4c0a990e8a467c279ca56))
* Draw commits additions vs deletions ([1312baf](https://github.com/ahmadalfy/gitlab-explorer/commit/1312bafb779aeb7f9e040e41705cee0861c00bd5))
* Fetch and store project commits ([d10154d](https://github.com/ahmadalfy/gitlab-explorer/commit/d10154d23ba93c0c9416eba127151ce8e03ef911))
* Set maximum zoom level to one day ([9a62032](https://github.com/ahmadalfy/gitlab-explorer/commit/9a620322183143ef9a5ec35321a49750e6e39389))
* **Commits:** Add commits panel ([eb08940](https://github.com/ahmadalfy/gitlab-explorer/commit/eb0894096ecd5d945eca633d984123e1c62bbf01))


### Performance Improvements

* Request less project info to reduce db size ([310db98](https://github.com/ahmadalfy/gitlab-explorer/commit/310db989e7b194a0d1ba8d018d7abd518c12f3ac))

# [1.4.0](https://github.com/ahmadalfy/gitlab-explorer/compare/v1.3.0...v1.4.0) (2020-02-04)


### Bug Fixes

* **projects:** Display project name on chart ([1e8fc22](https://github.com/ahmadalfy/gitlab-explorer/commit/1e8fc22531e8ed7e54a062d20cc3c68857345a45))
* Add zoom to detailed chart ([f1e4ffd](https://github.com/ahmadalfy/gitlab-explorer/commit/f1e4ffda97a95f43aa340e5548650967d596b96a))
* Loading new members activities not working ([6015618](https://github.com/ahmadalfy/gitlab-explorer/commit/60156186fc7a0d3a8559f371c8af812fbecb5d92))
* Sort data supplied to chart ascendingly ([16650f0](https://github.com/ahmadalfy/gitlab-explorer/commit/16650f0c0b3a150a20d457af501b8facb93eba1e))


### Features

* **project:** Group actionlist buttons together ([a9b5893](https://github.com/ahmadalfy/gitlab-explorer/commit/a9b58939f7df080085b6b2313ce457ffacdf934a))
* change project chart type ([1759abb](https://github.com/ahmadalfy/gitlab-explorer/commit/1759abbc09b60d277e4100c42f722a1881f79f7b))
* **projects:** Add append to chart ([d97eabc](https://github.com/ahmadalfy/gitlab-explorer/commit/d97eabc30df180aa6ed85a2c4fc9fee7e6a66eb8))
* **projects:** Draw project activity chart ([82b6a91](https://github.com/ahmadalfy/gitlab-explorer/commit/82b6a9184983932c4d0874739f4c200d628a998a))
* **projects:** Separate load from show activities ([fa2bea3](https://github.com/ahmadalfy/gitlab-explorer/commit/fa2bea37f0d631198e39f7494ec86579ef1778bb))
* Add chart zooming options for recent activities ([95e6e02](https://github.com/ahmadalfy/gitlab-explorer/commit/95e6e02ff1b4e4f554fae46ce5745e1d3a717cae))
* Add search event to detect field clearance ([1f22a56](https://github.com/ahmadalfy/gitlab-explorer/commit/1f22a56356ea5bcb0e995b5660a4d754e0cd909a))
* Display detailed activity for the user ([f0e80bb](https://github.com/ahmadalfy/gitlab-explorer/commit/f0e80bbcbd21789c4f3e57220c1bd1e5e3bedd9b))


### Performance Improvements

* **db:** Remove unneeded member object from member_events ([5e66e2a](https://github.com/ahmadalfy/gitlab-explorer/commit/5e66e2aba441924fb4b48eabc8b50f990a0739b2))

# [1.3.0](https://github.com/ahmadalfy/gitlab-explorer/compare/v1.2.0...v1.3.0) (2020-02-04)


### Features

* multiple data related stuff ([#23](https://github.com/ahmadalfy/gitlab-explorer/issues/23)) ([66ebe2d](https://github.com/ahmadalfy/gitlab-explorer/commit/66ebe2d3e8ef0672f34ac8d5f68b086fcceb2404))

# [1.2.0](https://github.com/ahmadalfy/gitlab-explorer/compare/v1.1.0...v1.2.0) (2020-01-31)


### Bug Fixes

* Filter now is working on table data only ([888a702](https://github.com/ahmadalfy/gitlab-explorer/commit/888a702eccbd433051a5ac4f894398035178356f))


### Features

* Add filtration by activity for projects ([c45aaa2](https://github.com/ahmadalfy/gitlab-explorer/commit/c45aaa27f6fdbcf3b528bd26f07a1f0432573ada))

# [1.1.0](https://github.com/ahmadalfy/gitlab-explorer/compare/v1.0.0...v1.1.0) (2020-01-31)


### Features

* Add basic filtration function to panels ([97382f8](https://github.com/ahmadalfy/gitlab-explorer/commit/97382f8ed7506d381ececc6fdafbbff67a723175))
* Add free text search for table ([8e2bb37](https://github.com/ahmadalfy/gitlab-explorer/commit/8e2bb37867e827587c2730d97ba6319246e3d7f1))

# 1.0.0 (2020-01-22)


### Bug Fixes

* data-handler returning wrong data ([5df7df2](https://github.com/ahmadalfy/gitlab-explorer/commit/5df7df24332060a0343cbd2f3136d465f9f936a3))
* display project group the first time correctly ([fbe916d](https://github.com/ahmadalfy/gitlab-explorer/commit/fbe916d559a30f9c4bfac2f89746fe52a1cd4332))
* loading groups not updating count ([e8e94fc](https://github.com/ahmadalfy/gitlab-explorer/commit/e8e94fcabb64f1e3d15aa1e298714682ca720512))


### Features

* add charts from members ([7bd4b24](https://github.com/ahmadalfy/gitlab-explorer/commit/7bd4b244bed0f696c5981d0291e787cd29be0db2))
* add import/export/delete functionality ([013fe18](https://github.com/ahmadalfy/gitlab-explorer/commit/013fe183a3c5425acb21cbe3dbec65f37b986926))
* add members listing ([368d0fa](https://github.com/ahmadalfy/gitlab-explorer/commit/368d0fa1749984bf55d24fbd1e9edd4ae6ef40ef))
* add projects listing ([c370c5d](https://github.com/ahmadalfy/gitlab-explorer/commit/c370c5dcd9677a276b7e53afeb62d03ba709b9a3))
* add zoom to timeline ([76442e8](https://github.com/ahmadalfy/gitlab-explorer/commit/76442e83ef11731a074f4834ac332b5534452d5f))
* display last user activity ([96f0c2e](https://github.com/ahmadalfy/gitlab-explorer/commit/96f0c2e578ea3e86572fbad36373d0fc3ac51f9a))
* draw multiple streams on the chart ([6c739c5](https://github.com/ahmadalfy/gitlab-explorer/commit/6c739c5b360da90bec6cae30718cad68bc257e65))
* setup workflow, local db handler, add groups ([5b05e4a](https://github.com/ahmadalfy/gitlab-explorer/commit/5b05e4a284dcf7c45b670ff2b35285a3c34720f5))
