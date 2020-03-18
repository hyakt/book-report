# -*- coding: utf-8 -*-

# テストスイートを管理するクラス
class TestCase:
    def __init__(self, name):
        self.name = name
    def setUp(self):
        pass
    def tearDown(self):
        pass
    #  テストメソッドを動的に呼び出す
    def run(self):
        self.setUp()
        method = getattr(self, self.name)
        method()
        self.tearDown()

# テストメソッドが実行されたか記録するクラス
class WasRun(TestCase):
    def setUp(self):
        self.log = "setUp "
    # メソッドが実行されたか記録するメソッド
    def testMethod(self):
        self.log = self.log + "testMethod "
    def tearDown(self):
        self.log = self.log + "tearDown "

# テストスイートをテストするクラス
class TestCaseTest(TestCase):
    def testTemplateMethod(self):
        test = WasRun("testMethod")
        test.run()
        assert("setUp testMethod tearDown " == test.log)

TestCaseTest("testTemplateMethod").run()
