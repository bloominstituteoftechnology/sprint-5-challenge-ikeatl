async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇

  const footer = document.querySelector('footer')
  const currentYear = new Date().getFullYear()
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`

  async function fetchData() {
    try {
      const learners = await getLearner();
      const mentors = await getMentor();
      learnerCardMaker(learners, mentors);
    } catch (error) {
      console.error(error.message);
    }
  }

  const entryPoint = document.querySelector('.cards');
  const info = document.querySelector(".info");

  function learnerCardMaker(learners, mentors) {
    const fullLearners = learners.map(learner => replaceMentorIdsWithNames(learner, mentors));


    fullLearners.forEach(learner => {
      const learnerCard = document.createElement('div');
      const h3Name = document.createElement('h3');
      const emailDiv = document.createElement('div');
      const h4MentorsDropDown = document.createElement("h4");
      const ulMentorNames = document.createElement("ul");

      h3Name.textContent = `${learner.fullName}`;
      emailDiv.textContent = `${learner.email}`;
      h4MentorsDropDown.textContent = `Mentors`
      h4MentorsDropDown.classList.add("closed")

      learner.mentors.forEach(mentorName => {
        const liMentorNames = document.createElement('li');
        liMentorNames.textContent = `${mentorName}`
        ulMentorNames.appendChild(liMentorNames)
      })

      learnerCard.classList.add('card')

      h4MentorsDropDown.addEventListener('click', (event) => {
        const isOpen = h4MentorsDropDown.classList.contains('open');
        if (learnerCard.classList.contains('selected')) {
          event.stopPropagation()
        }

        h4MentorsDropDown.classList.toggle('open', !isOpen)
        h4MentorsDropDown.classList.toggle('closed', isOpen)

        if (isOpen) {
          ulMentorNames.style.display = "none";
        } else {
          ulMentorNames.style.display = "block";
        }
      })


      learnerCard.addEventListener('click', () => {
        const isCardSelected = learnerCard.classList.contains('selected');

        document.querySelectorAll('.card.selected').forEach(ele => {
          ele.classList.remove('selected')
        })

        learnerCard.classList.toggle('selected', !isCardSelected)

        h3Name.textContent = learnerCard.classList.contains('selected') ?
          `${learner.fullName}, ID ${learner.id}` : `${learner.fullName}`

        info.textContent = learnerCard.classList.contains('selected') ?
          `The selected learner is ${learner.fullName}` :
          "No learner is selected";
      })

      learnerCard.appendChild(h3Name)
      learnerCard.appendChild(emailDiv)
      learnerCard.appendChild(h4MentorsDropDown)
      learnerCard.appendChild(ulMentorNames)
      entryPoint.appendChild(learnerCard)
    })

    info.textContent = "No learner is selected"


    return entryPoint
  }

  async function getLearner() {
    try {
      const response = await axios.get(`http://localhost:3003/api/learners`)
      return response.data
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async function getMentor() {
    const response = await axios.get(`http://localhost:3003/api/mentors`)
      .then(res => {
        console.log(res.data)
        return res.data
      })
      .catch(err => {
        console.error(err)
      })
    return response
  }

  function replaceMentorIdsWithNames(learner, mentors) {
    const updatedMentors = learner.mentors.map(learnerMentorId => {
      const mentor = mentors.find(m => m.id === learnerMentorId);
      if (mentor) {
        return `${mentor.firstName} ${mentor.lastName}`;
      }
    });

    return { ...learner, mentors: updatedMentors };
  }
  fetchData();
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
