# Contributing

## Code of Conduct

All members of the project community must abide by the [Contributor Covenant, version 2.1](CODE_OF_CONDUCT.md). Only by respecting each other we can develop a productive, collaborative community. Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting [support@kulturpass.de](mailto:support@kulturpass.de) and/or a project maintainer.

We appreciate your courtesy of avoiding political questions here. Issues which are not related to the project itself will be closed by our community managers.

## Issues and Planning

* We use GitHub issues to track bugs and enhancement requests. Please always have a look at the open and closed issues before creating a new one.

* Please provide as much context as possible when you open an issue. The information you provide must be comprehensive enough to reproduce that issue for the assignee.

## Engaging in Our Project

* Before you start contributing a fix or even a feature, please always create an issue first and wait for the reaction of the project maintainers. As the project is mainly driven by the requirements of our project partners it might be the case that we can't accept all [pull requests](#pull-request-checklist), especially if they include new features.

* The project team decided to focus on the publication of our project milestones instead of every single commit at the moment. In other words, the actual development is currently done on an internal platform. We will take care that accepted [pull requests](#pull-request-checklist) will be merged with the internal codebase.

* Feel free to reach out to us and send an [email](support@kulturpass.de) if you plan to implement something larger or if you have a topic that can't be discussed in GitHub issues.

## Steps to Contribute

* Should you wish to work on an issue, please claim it first by commenting on the GitHub issue that you want to work on. This is to prevent duplicated efforts from other contributors on the same issue.

* If you have questions about one of the issues, please comment on them, and one of the maintainers will clarify.

* We use GitHub to manage reviews of pull requests and kindly ask you to follow the [Pull Request Checklist](#pull-request-checklist) to ensure that these reviews can performed properly.

## Contributing Code

* You are welcome to contribute code in order to fix a bug or to implement a new feature.

* The following rule governs code contributions:
  * Contributions must be licensed under the [Apache 2.0 License](LICENSE)
  * Relevant coding style guidelines are available in the respective sub-repositories as they are programming language-dependent.
  * Contributions must be done via pull requests

## Contributing Documentation

* You are welcome to contribute documentation to the project.

* The following rule governs documentation contributions:
  * Contributions must be licensed under the same license as code, the [Apache 2.0 License](LICENSE)
  * Contributions must be done via pull requests

## Pull Request Checklist

* Use a [git GUI interface](https://git-scm.com/downloads/guis/) if you are new to `git`. It will help you getting familiar with the basic submission workflow.

* Branch from the `main` branch and also target `main` with your Pull Request.

* Commits should be as small as possible while ensuring that each commit is correct independently (i.e., each commit should compile and pass tests).
  * If you notice a small error in your latest commit, you should [amend](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) fixes instead of creating a new commit.
  * If you make several related fixup commits in a row, you should [squash](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) them into a single commit.
  * Use [restore](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things) operations if you want to revert a change in a commit.

* If your patch is not getting reviewed or you need a specific person to review it, you can @-reply a reviewer asking for a review in the pull request or a comment, or you can ask for a review by contacting us via [email](mailto:support@kulturpass.de).

* Post review:
  * Integrate the requested changes into your submission.
  * Set respective comments in your GitHub review to resolved.
  * [Rebase](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) your PR to the latest upstream `main` branch.
  * Create a general PR comment to notify the reviewers that your amendments are ready for another round of review.
