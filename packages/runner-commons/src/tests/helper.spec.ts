import { UUVCliHelper } from "../cli/helper";

describe("Helper", () => {

  test("translateString - should convert all found keys in input string", () => {
    const inputStr = "Hello ${user.firstname} ${user.lastname}, welcome to ${place}${subPlace} !";
    const translations = {
      user: {
        firstname: "Richard",
        lastname: "Bona"
      },
      place: "Bonamoussadi",
      subPlace: "(Carrefour Maçon)"
    };
    expect(UUVCliHelper.translateString(inputStr, translations))
      .toEqual("Hello Richard Bona, welcome to Bonamoussadi(Carrefour Maçon) !");
  });

  test("translateString - should even convert when some keys are not found", () => {
    const inputStr = "Hello ${user.firstname} ${user.lastname}, welcome to ${place}${subPlace} !";
    const translations = {
      user: {
        firstname: "Richard",
        lastname: "Bona"
      },
      place: "Bonamoussadi"
    };
    expect(UUVCliHelper.translateString(inputStr, translations))
      .toEqual("Hello Richard Bona, welcome to Bonamoussadi${subPlace} !");
  });
});
