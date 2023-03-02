const $wrapper = document.querySelector('[data-wr]');
const $addCard = document.querySelector('[data-action="addCard"]');
const $modal = document.querySelector('[data-modal]');
const $exit = document.querySelector('.exit');
const $data_modal_card = document.querySelector('[data-modal_card]');
const $modal_title = document.querySelector('.modal-title');
const $rateDog = document.querySelector('.rateDog');
const $imgDog = document.querySelector('.dog_image');
const $favoriteDog1 = document.querySelector('.favoriteDog1');
const $favoriteDog2 = document.querySelector('.favoriteDog2');
const $ageDog = document.querySelector('.ageDog');
const $descriptionDog = document.querySelector('.descriptionDog');
const $modalDog = document.querySelector('.modal_dog');
const $close = document.querySelector('.close');
const $infoCardAll = document.querySelector('.infoCardAll');
const $button_edit = document.querySelector('[data-edit_card]');
const $button_save = document.querySelector('[data-save_card]');

const genDogCard = (dog) => {
  return `
<div data-card_id=${dog.id} class='card_cont position-relative '>
    <div class="card" style="width: 300px;margin:10px;border-radius: 20px;height: 520px;justify-content: center;align-items: center;">
      <img class='heart' src="${heart}" alt="heart" style="height: 35px;width: 35px;position: absolute;top: 20px;left: 20px;">
      <img src="${dog.image}" class="card-img-top p-3 dog_image" alt="super Dog" style="height: 250px;width: 250px;justify-content: center; align-items: center;margin-top: 40px;">
      <div class="card-body">
        <h5 class="card-title" style="padding: 10px 10px;">${dog.name}</h5>
        <div class='block'>
          <p class="card-text"">${dog.description}</p>
        </div>
        <div class="cont_btn position-absolute">
          <button type='button' data-action="open" class="btn but btn1">Open</button>
          <button type='button' data-action="delete" class="btn but btn3">Delete</button>
        </div>
    </div>
</div>
`;
};

//fetch(`https://cats.petiteweb.dev/api/single/${myHubName}/show`)
// api
//   .getAllDogs()
//   .then((res) => {
//     console.log({ res });
//     return res.json();
//   })
//   .then((data) => {
//     console.log(data);
//     data.forEach((dog) => {
//       $wrapper.insertAdjacentHTML('afterbegin', genDogCard(dog));
//     });
//   });
let idDog = undefined;
let heart = false;
$wrapper.addEventListener('click', async (event) => {
  const action = event.target.dataset.action;

  switch (action) {
    case 'delete':
      const $currentCard = event.target.closest('[data-card_id]');
      // console.log($currentCard);
      const dogId = $currentCard.dataset.card_id;
      // console.log(dogId);
      try {
        const res = await api.deleteDog(dogId);
        const response = await res.json();
        if (!res.ok) throw Error(response.message);
        // console.log(response);
        $currentCard.remove();
      } catch (err) {
        console.log(err);
      }
      break;
    case 'open':
      const $curDog = event.target.closest('[data-card_id]');

      const dogId2 = $curDog.dataset.card_id;

      idDog = $curDog.dataset.card_id;
      try {
        const res = await api.getCurrentDog(dogId2);
        const response = await res.json();
        console.log(response.favorite);

        $modal_title.placeholder = `${response.name}`;
        $modal_title.textContent = `${response.name}`;
        $ageDog.value = `${response.age}`;
        $favoriteDog1.value = response.favorite
          ? ($favoriteDog1.checked = true)
          : ($favoriteDog2.checked = true);
        $rateDog.value = `${response.rate}`;
        $descriptionDog.value = ` ${response.description}`;
        heart = response.favorite;
        $modalDog.classList.remove('hidden');

        $favoriteDog1.checked = false;
        $favoriteDog2.checked = false;
      } catch (error) {
        console.log(error);
      }
      break;
  }
});
button_edit = () => {
  $modal_title.disabled = false;
  $ageDog.disabled = false;
  $favoriteDog1.disabled = false;
  $favoriteDog2.disabled = false;
  $rateDog.disabled = false;
  $descriptionDog.disabled = false;
};
exitEditCard = () => {
  $modal_title.disabled = true;
  $ageDog.disabled = true;
  $favoriteDog1.disabled = true;
  $favoriteDog2.disabled = true;
  $rateDog.disabled = true;
  $descriptionDog.disabled = true;
};
$button_save.addEventListener('click', async (event) => {
  event.preventDefault();

  const res = await api.getCurrentDog(idDog);
  const response = await res.json();

  const editCard = {
    id: +idDog,
    age: +$ageDog.value,
    rate: +$rateDog.value,
    favorite:
      $favoriteDog1.checked === true ? (response.favorite = true) : (response.favorite = false),
    image: response.image,
    name: $modal_title.value ? $modal_title.value : response.name,
    description: $descriptionDog.value,
  };

  const res1 = await api.updateDog(idDog, editCard);
  const response1 = await res1.json();

  $wrapper.replaceChildren();

  allGetDogs();

  $modalDog.classList.add('hidden');

  exitEditCard();
});

$button_edit.addEventListener('click', (event) => {
  button_edit();
});

$close.addEventListener('click', (event) => {
  $modalDog.classList.add('hidden');
});

$addCard.addEventListener('click', (event) => {
  $modal.classList.remove('hidden');
});

document.forms.add_dogs_form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(event.target).entries());
  console.log(data);
  data.id = Number(data.id);
  data.age = Number(data.id);
  data.rate = Number(data.id);
  data.favorite = !!data.favorite;
  // console.log(data);

  const res = await api.newDog(data);

  if (res.ok) {
    $wrapper.replaceChildren();
    allGetDogs();
  }
  const response = await res.json();

  console.log(response);
  event.target.reset();

  $modal.classList.add('hidden');
  localStorage.clear();
});

$exit.addEventListener('click', (event) => {
  $modal.classList.add('hidden');
});

const allGetDogs = async () => {
  const res = await api.getAllDogs();

  if (res.status !== 200) {
    const $errorMessage = document.createElement('p');
    $errorMessage.classList.add('errorMessage');
    $errorMessage.innerText = 'Произошла ошибка , зайдите позже';
    return $wrapper.appendChild($errorMessage);
  }

  const data = await res.json();

  if (data.length === 0) {
    const $notification = document.createElement('p');
    $notification.innerText = 'Список ПУСТ';
    return $wrapper.appendChild($notification);
  }
  data.forEach((el) => {
    if (el.favorite === true) {
      heart = `./src/img/heartred.png`;
    } else {
      heart = `./src/img/heart.png`;
    }
    $wrapper.insertAdjacentHTML('beforeend', genDogCard(el));
  });
};

allGetDogs();
