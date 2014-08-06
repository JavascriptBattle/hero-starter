
![Javascript Battle Hero](http://javascriptbattle.com/img/black-knight.png)

#Javascript Battle - Hero Starter Repo#

---
##Play Now##  

If you are anxious to join the fight (and who wouldn't be), then all you need to do is fork this repo and let us know your username and repo name on sign-up. It really is that easy. We have a lot of shenanigans going on in the background to make this happen and we have tried to make this process as seamless as possible.


####Steps To Play Now####

1. If you haven't already, please sign up for [GitHub](https://github.com/join).
2. After signing up, navigate back to this page and at the top right of your screen, click the 'Fork' button.
3. When you click the 'Fork' button, you will be asked where you want to fork this repo. Go ahead and click your repo. This will effectively copy this repo into your repo.
4. BAM!!! Now, you have a working repo in your account! Nice! 
5. The only things left to do is navigate to the [Javascript Battle](http://javascriptbattle.com/) website and sign up. Make sure you tell us the name of your repo. 
  * **Hint** - You can find this info by looking at the url when you are in your repo. For example, the url for my repo is 'github.com/forrestbthomas/hero-starter'. My username is 'forrestbthomas' and my repo name is 'hero-starter'.
6. At this point, you have a working repo, with working hero code and you can watch your hero tilt with the best in tomorrow's battle. Once you are ready, you can begin diving in to the code, to make your hero even stronger and make Javascript Battle even more glorious!

##Advanced Play##

1. Cloning, Adding and Committing
2. The Hero's Brain
3. Pushing and Waiting

####Cloning, Adding and Committing####
You already have a working hero. You have watched the epic-ness that is your champion battling against other noble heroes. However, there comes a time in every hero's journey, when training becomes necessary.
In order to upgrade your hero's code you will first need to clone your hero-starter repo on to your local machine. If you are new to Git, this may sound intimidating, but once you get the hang of it, it will become second nature. The purpose of this Readme is not to give an overview of Git, but to give you enough to get started, If you want to learn more, and we definitely recommend that you do, you can check out these great resources:
  * [Git Documentation](http://git-scm.com/doc)
  * [Youtube Intro](https://www.youtube.com/watch?v=75_UrC2unv4&feature=youtu.be)
  * [Git Immersion](http://gitimmersion.com/)
  * [Git Cheatsheet](http://www.git-tower.com/blog/git-cheat-sheet-detail/)

######Steps######
1. Navigate to your repo and find the 'HTTPS clone URL' button, make sure you are cloning with 'HTTPS' and click the 'Copy to Clipboard' button.
2. Create a new folder on your file system somewhere and navigate to that folder in the command line.
  * If you are new to the command line, a quick Google search will return some good results for command line introductions on your OS.
3. Once there, you will need to clone your repo using the following command:
```
git clone <your clipboard-repo-url>
```
For example, to clone my repo, I would use:
```
git clone https://github.com/forrestbthomas/hero-starter.git
```
4. Now, Git is tracking this repo on your local machine. When you make changes to any file in this repo, Git will know about it. Go ahead and open up your hero.js file.
  * To learn more about the code in your hero.js file, take a look at our [wiki](www.javascriptbattle.com/wiki). 
5. Make some changes to the code.
6. Now, go back to the command line, navigate to the directory containing the hero.js file and check the status of your file with the following command:
```
git status
```
Your terminal should read:
```
# On branch master
# Changes not staged for commit:
#   (use "git add <file>..." to update what will be committed)
#   (use "git checkout -- <file>..." to discard changes in working directory)
#
# modified:   hero.js
#
no changes added to commit (use "git add" and/or "git commit -a")
```
Git is telling us that you have made changes to your file and wants to know what to do. 
7. Skipping some of the details, you will need to type the following:
```
git add hero.js
```
This stages your hero.js file for a commit
8. Then type:
```
git commit
```
This will bring up a prompt in your terminal for you to write a message. This message will help you later keep track of what you changed when. Go ahead and type something descriptive of the change you just made. When done, close the window by pressing "ESC", ":", "w" and "q".
9. Now, Git knows about your changes and has a record of the changes you have made. Before moving on to 'pushing,' let's pause and take a look at what is going on in hero.js.